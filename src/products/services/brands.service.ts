import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Brand } from '../entities/brand.entity';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dtos';

@Injectable()
export class BrandsService {
  constructor(@InjectModel(Brand.name) private brandModel: Model<Brand>) {}

  async findAll() {
    return await this.brandModel.find();
  }

  async findOne(id: number) {
    const product = await this.brandModel.findOne({ _id: id });
    if (!product) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return product;
  }

  create(data: CreateBrandDto) {
    const newBrand = new this.brandModel(data);
    return newBrand.save();
  }

  async update(id: number, changes: UpdateBrandDto) {
    const product = await this.brandModel.findByIdAndUpdate(
      id,
      { $set: changes },
      { new: true },
    );
    if (!product) {
      throw new NotFoundException(`Brand #${id} not found`);
    }
    return product;
  }

  remove(id: number) {
    return this.brandModel.findByIdAndDelete(id);
  }
}
