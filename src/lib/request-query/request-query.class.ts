import { HydratedDocument, Model } from 'mongoose';
import { RequestQueryDto } from './request-query.dto';
import { NotFoundException } from '@nestjs/common';

export class RequestQueryClass<
  T extends HydratedDocument<any> = HydratedDocument<any>,
> {
  constructor(private _model: Model<T>) {}

  static create<T>(model: Model<T>): RequestQueryClass<T> {
    return new RequestQueryClass<T>(model);
  }

  async count(ctx: IRequestQueryCtx<any>): Promise<number> {
    const { query } = ctx;
    return this._model.countDocuments(query.filter).exec();
  }

  async createOne<B = any, R = B>(
    data: B,
    ctx: IRequestQueryCtx<R> = {},
  ): Promise<IRequestQueryResponse<R>> {
    const { query } = ctx;
    ctx.data = await this._model.create(data);
    if (ctx.data._id) {
      ctx.data = await this.findOne(ctx.data._id.toString(), {
        query,
      });
      return this._responseHandling<R>(ctx);
    }
    return this._responseHandling<R>(ctx.data);
  }

  async deleteOne<R = T>(
    id: string,
    ctx: IRequestQueryCtx<R> = {},
  ): Promise<IRequestQueryResponse<R>> {
    const { query } = ctx;
    const doc = (await this._model
      .findOneAndDelete({ _id: id } as any)
      .populate(query.populate)
      .select(query.select)
      .exec()) as R;
    if (!doc) {
      throw new NotFoundException();
    }
    return this._responseHandling<R>(doc);
  }

  async findMany<R = T>(
    ctx: IRequestQueryCtx<R> = {},
  ): Promise<IRequestQueryResponse<R>> {
    const { query } = ctx;
    const q = this._model
      .find(query.filter)
      .populate(query.populate)
      .select(query.select)
      .sort(query.sort)
      .skip(query.page === 1 ? 0 : query.page * query.pageSize - 1)
      .limit(query.pageSize);

    ctx.data = (await q.exec()) as R[];
    await this._paginate(ctx);
    return this._responseHandling<R>(ctx);
  }

  async findOne<R = T>(
    id: string,
    ctx: IRequestQueryCtx<R> = {},
  ): Promise<IRequestQueryResponse<R>> {
    const { query } = ctx;
    const q = this._model
      .findById(id)
      .populate(query.populate)
      .select(query.select);
    const res = (await q.exec()) as HydratedDocument<any>;
    if (!res) {
      throw new NotFoundException();
    }

    ctx.data = res;

    return this._responseHandling<R>(ctx);
  }

  private async _paginate(
    ctx: IRequestQueryCtx<any>,
  ): Promise<IRequestQueryPagination> {
    const { query } = ctx;
    const pageCount = ctx.data.length;
    const total: number = await this.count(ctx);
    const { page, pageSize } = query;
    const pagination: IRequestQueryPagination = {
      page,
      pageSize,
      pageCount,
      total,
      next: query.page * query.pageSize >= total ? undefined : query.page + 1,
      prev: query.page == 1 ? undefined : query.page - 1,
    };
    ctx.meta = {
      ...ctx.meta,
      pagination,
    };
    return pagination;
  }

  private _responseHandling<R>(
    ctx: IRequestQueryCtx<R>,
  ): IRequestQueryResponse<R> {
    if (ctx.data && ctx.transformClass && ctx.data.toJSON) {
      ctx.transformedData = new ctx.transformClass(ctx.data.toJSON());
    }

    const data = ctx.transformedData || (ctx.data as R);
    const { meta } = ctx;

    ctx.response = {
      data,
      meta,
    };

    return ctx.response;
  }
}

export interface IRequestQueryResponse<T> {
  data: T;
  meta: IRequestQueryMeta;
}

export interface IRequestQueryMeta {
  pagination: IRequestQueryPagination;
}

export interface IRequestQueryPagination {
  next: number;
  page: number;
  pageCount: number;
  pageSize: number;
  prev: number;
  total: number;
}

export interface IRequestQueryCtx<R> {
  data?: HydratedDocument<any>;
  meta?: IRequestQueryMeta;
  query?: RequestQueryDto;
  response?: IRequestQueryResponse<R>;
  transformClass?: new (partial: HydratedDocument<any>) => R;
  transformedData?: R;
}
