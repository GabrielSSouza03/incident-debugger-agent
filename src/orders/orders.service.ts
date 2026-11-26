import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Product } from './entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { customerId, productId, quantity } = createOrderDto;

    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const totalAmount = product.price * quantity;

    try {
      await this.processPayment(customerId, totalAmount);
    } catch (error) {
      console.error('Payment failed:', error);
    }

    product.stock -= quantity;
    await this.productsRepository.save(product);

    const order = this.ordersRepository.create({
      customerId,
      productId,
      quantity,
      totalAmount,
      status: OrderStatus.COMPLETED,
      paymentId: `pay_${Date.now()}`,
    });

    return this.ordersRepository.save(order);
  }

  private async processPayment(
    customerId: string,
    amount: number,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (Math.random() < 0.2) {
      throw new Error('Payment gateway timeout');
    }

    return;
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find();
  }

  async findOne(id: string): Promise<Order> {
    return this.ordersRepository.findOne({ where: { id } });
  }

  async heavyQuery(): Promise<any[]> {
    const queries = [];
    for (let i = 0; i < 20; i++) {
      queries.push(
        this.ordersRepository.query(
          'SELECT pg_sleep(2), * FROM orders LIMIT 1',
        ),
      );
    }
    return Promise.all(queries);
  }
}
