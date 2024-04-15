'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.RequestQueryClass = void 0;
const common_1 = require('@nestjs/common');
class RequestQueryClass {
  constructor(_model) {
    this._model = _model;
  }
  static create(model) {
    return new RequestQueryClass(model);
  }
  count(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
      const { query } = ctx;
      return this._model.countDocuments(query.filter).exec();
    });
  }
  createOne(data_1) {
    return __awaiter(this, arguments, void 0, function* (data, ctx = {}) {
      const { query } = ctx;
      ctx.data = yield this._model.create(data);
      if (ctx.data._id) {
        ctx.data = yield this.findOne(ctx.data._id.toString(), {
          query,
        });
        return this._responseHandling(ctx);
      }
      return this._responseHandling(ctx.data);
    });
  }
  deleteOne(id_1) {
    return __awaiter(this, arguments, void 0, function* (id, ctx = {}) {
      const { query } = ctx;
      const doc = yield this._model
        .findOneAndDelete({ _id: id })
        .populate(query.populate)
        .select(query.select)
        .exec();
      if (!doc) {
        throw new common_1.NotFoundException();
      }
      return this._responseHandling(doc);
    });
  }
  findMany() {
    return __awaiter(this, arguments, void 0, function* (ctx = {}) {
      const { query } = ctx;
      const q = this._model
        .find(query.filter)
        .populate(query.populate)
        .select(query.select)
        .sort(query.sort)
        .skip(query.page === 1 ? 0 : query.page * query.pageSize - 1)
        .limit(query.pageSize);
      ctx.data = yield q.exec();
      yield this._paginate(ctx);
      return this._responseHandling(ctx);
    });
  }
  findOne(id_1) {
    return __awaiter(this, arguments, void 0, function* (id, ctx = {}) {
      const { query } = ctx;
      const q = this._model
        .findById(id)
        .populate(query.populate)
        .select(query.select);
      const res = yield q.exec();
      if (!res) {
        throw new common_1.NotFoundException();
      }
      ctx.data = res;
      return this._responseHandling(ctx);
    });
  }
  _paginate(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
      const { query } = ctx;
      const pageCount = ctx.data.length;
      const total = yield this.count(ctx);
      const { page, pageSize } = query;
      const pagination = {
        page,
        pageSize,
        pageCount,
        total,
        next: query.page * query.pageSize >= total ? undefined : query.page + 1,
        prev: query.page == 1 ? undefined : query.page - 1,
      };
      ctx.meta = Object.assign(Object.assign({}, ctx.meta), { pagination });
      return pagination;
    });
  }
  _responseHandling(ctx) {
    if (ctx.data && ctx.transformClass && ctx.data.toJSON) {
      ctx.transformedData = new ctx.transformClass(ctx.data.toJSON());
    }
    const data = ctx.transformedData || ctx.data;
    const { meta } = ctx;
    ctx.response = {
      data,
      meta,
    };
    return ctx.response;
  }
}
exports.RequestQueryClass = RequestQueryClass;
