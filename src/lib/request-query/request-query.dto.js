'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.RequestQueryDto = void 0;
const swagger_1 = require('@nestjs/swagger');
const class_transformer_1 = require('class-transformer');
const class_validator_1 = require('class-validator');
class RequestQueryDto {
  constructor() {
    this.filter = {};
    this.page = 1;
    this.pageSize = 10;
    this.populate = [];
    this.select = [];
  }
}
exports.RequestQueryDto = RequestQueryDto;
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description:
        'Filter query string (JSON), see documentation for its schema',
      required: false,
      type: String,
    }),
    (0, class_transformer_1.Transform)((v) => filterQueryToObject(v.value)),
    (0, class_validator_1.IsObject)(),
  ],
  RequestQueryDto.prototype,
  'filter',
  void 0,
);
__decorate(
  [
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Page number',
      example: 1,
      required: false,
    }),
  ],
  RequestQueryDto.prototype,
  'page',
  void 0,
);
__decorate(
  [
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(0),
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Number of items per page',
      example: 10,
      required: false,
    }),
  ],
  RequestQueryDto.prototype,
  'pageSize',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Fields to populate',
      required: false,
      type: [String],
      example: [''],
      default: [],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
      if (value && !(0, class_validator_1.isArray)(value)) {
        return [value];
      }
      if (!value) {
        return [];
      }
      return value;
    }),
    (0, class_validator_1.IsArray)(),
  ],
  RequestQueryDto.prototype,
  'populate',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description: 'Fields to select',
      required: false,
      type: [String],
      example: [''],
      default: [],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
      if (value && !(0, class_validator_1.isArray)(value)) {
        return [value];
      }
      if (!value) {
        return [];
      }
      return value;
    }),
    (0, class_validator_1.IsArray)(),
  ],
  RequestQueryDto.prototype,
  'select',
  void 0,
);
__decorate(
  [
    (0, swagger_1.ApiPropertyOptional)({
      description:
        'Only whitelisted properties separated by semicolon; prefix with -/+ for DESC/ASC order',
      example: {
        createdAt: 'desc',
      },
      default: {
        createdAt: 'desc',
      },
      required: false,
      type: String,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)((v) => filterQueryToObject(v.value)),
    (0, class_validator_1.IsObject)(),
  ],
  RequestQueryDto.prototype,
  'sort',
  void 0,
);
function filterQueryToObject(v) {
  if (!v) return {};
  return JSON.parse(v);
}
