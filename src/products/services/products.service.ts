import { Injectable, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Product } from './../entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './../dtos/products.dtos';
import { FilterProductsDto } from '../dtos/products.dtos';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async findAll(params?: FilterProductsDto) {
    if (params) {
      const filters: FilterQuery<Product> = {};
      const { limit, offset, minPrice, maxPrice } = params;
      if (minPrice && maxPrice) {
        filters.price = { $gte: minPrice, $lte: maxPrice };
      }
      return await this.productModel
        .find(filters)
        .populate('brand')
        .skip(offset)
        .limit(limit);
    }
    return await this.productModel.find().populate('brand');
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  async create(data: CreateProductDto) {
    const newProduct = new this.productModel(data);
    return await newProduct.save();
  }

  async update(id: string, changes: UpdateProductDto) {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      {
        $set: changes,
      },
      { new: true },
    );

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  remove(id: string) {
    return this.productModel.findByIdAndDelete(id);
  }
}
