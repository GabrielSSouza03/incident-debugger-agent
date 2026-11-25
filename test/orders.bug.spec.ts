import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../src/orders/orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../src/orders/entities/order.entity';
import { Product } from '../src/orders/entities/product.entity';

describe('OrdersService - Bug Reproductions (Intentional Failures)', () => {
  let service: OrdersService;
  let mockOrderRepo: any;
  let mockProductRepo: any;

  beforeEach(async () => {
    mockOrderRepo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      query: jest.fn(),
    };

    mockProductRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepo,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('[BUG-001] Race condition: payment failure silently swallowed', async () => {
    const mockProduct = {
      id: 'prod-1',
      name: 'Test Product',
      price: 100,
      stock: 10,
    };

    mockProductRepo.findOne.mockResolvedValue(mockProduct);
    mockProductRepo.save.mockResolvedValue({ ...mockProduct, stock: 9 });
    mockOrderRepo.create.mockReturnValue({
      customerId: 'cust-1',
      productId: 'prod-1',
      quantity: 1,
      totalAmount: 100,
      status: 'completed',
      paymentId: 'pay_123',
    });
    mockOrderRepo.save.mockResolvedValue({
      id: 'order-1',
      status: 'completed',
    });

    jest.spyOn(service as any, 'processPayment').mockRejectedValue(
      new Error('Payment gateway timeout'),
    );

    const result = await service.createOrder({
      customerId: 'cust-1',
      productId: 'prod-1',
      quantity: 1,
    });

    expect(result.status).toBe('completed');
    expect(mockProductRepo.save).toHaveBeenCalled();
  });

  it('[BUG-002] DB connection pool exhaustion on heavy query', async () => {
    mockOrderRepo.query.mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve([]), 2000)),
    );

    const startTime = Date.now();
    
    try {
      await service.heavyQuery();
    } catch (error) {
      const duration = Date.now() - startTime;
      expect(duration).toBeGreaterThan(2000);
    }
  });
});
