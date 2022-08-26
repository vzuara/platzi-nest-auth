import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Order } from '../entities/order.entity';
import { CreateOrderDto, UpdateOrderDto } from '../dtos/order.dto';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private orderModel: Model<Order>) {}

  async findAll() {
    return await this.orderModel
      .find()
      .populate('customer')
      .populate('products');
  }

  async findOne(id: string) {
    return this.orderModel
      .findById(id)
      .populate('customer')
      .populate('products');
  }

  create(data: CreateOrderDto) {
    const newModel = new this.orderModel(data);
    return newModel.save();
  }

  update(id: string, changes: UpdateOrderDto) {
    return this.orderModel.findByIdAndUpdate(
      id,
      { $set: changes },
      { new: true },
    );
  }

  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id);
  }

  async removeProduct(id: string, productId: string) {
    const order = await this.orderModel.findById(id);
    order.products.pull(productId);
    return order.save();
  }

  async addProducts(id: string, productsIds: string[]) {
    const order = await this.orderModel.findById(id);
    productsIds.forEach((pId) => order.products.push(pId));
    return order.save();
  }
}
