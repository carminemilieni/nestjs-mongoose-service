[![npm version](https://badge.fury.io/js/nestjs-mongoose-service.svg)](https://badge.fury.io/js/nestjs-mongoose-service)

<a href="https://ninjacoding.it/">
     <img src="https://raw.githubusercontent.com/carminemilieni/ninjacoding-commons/main/ninjacoding-primary-logo.svg" alt="NinjaCoding logo" title="NinjaCoding" height="60" />
</a>

# nestjs-mongoose-service

⭐️ Star this project on GitHub: it motivates me a lot!

> This project was born from the absence of libraries that work decently with Mongoose.
> It's a NestJS library that provides classes and methods for easy CRUD operations with Mongoose models.
>
>
> With this project, you can accept complex queries, paginate results, and select fields, all fully
> compatible with OpenAPI and Swagger generation.

## Prerequisites

This project was developed
using NodeJS v20.9.0, NPM v10.1.0 or Yarn v1.22.22 and NestJS v10.0.0.

- [Node](http://nodejs.org/) (v20.9.0)
- [NPM](https://npmjs.org/) (v10.1.0)
- [YARN](https://yarnpkg.com/) (v1.22.22)
- [NestJS](https://nestjs.com/) (v10.0.0)

Project dependencies:

- @nestjs/common: ^10.0.0
- @nestjs/config: ^3.2.0
- @nestjs/core: ^10.0.0
- @nestjs/mongoose: ^10.0.4
- @nestjs/platform-express: ^10.0.0
- @nestjs/swagger: ^7.3.0
- class-transformer: ^0.5.1
- class-validator: ^0.14.1
- mongoose: ^8.2.3

I do not guarantee backward compatibility with previous versions of NodeJS and NPM.
Any requests are welcome.

## Summary

- [Installation](#installation)
- [Usage](#usage)
    - [Create Controller, Service and Entity](#create-controller-service-and-entity)
    - [In your service](#in-your-service)
- [Apologies](#apologies)
- [License](#license)

## Installation

**BEFORE INSTALLING:** please read the [prerequisites](#prerequisites)

Depending on the package manager you prefer, you can install the library with npm or yarn.

```shell
$ npm install -S nestjs-mongoose-service
```

Or if you prefer to use Yarn:

```shell
yarn add nestjs-mongoose-service
```

## Usage

### Create Controller, Service and Entity

Controller

```ts
// ...
import { RequestQueryDto } from 'nestjs-mongoose-service';

// ...

export class ExampleController {
  constructor(private _serviceName: ServiceName) {
  }

  // ...
  async createOne(@Body() body: ExampleDto, @Query(new ValidationPipe({ transform: true })) query: RequestQueryDto) {
    return this._serviceName.createOne(body, query);
  }

  // ...
}

// example.controller.ts
```

In your entity file (optional)
if you want use entity remember to add `@UseInterceptors(ClassSerializerInterceptor)` before the controller method.

```ts
// ...
export class ExampleEntity {
  // ...
  fieldName: string;
  @Exclude()
  fieldName2: string;

  // ...
  constructor(partial: Partial<ExampleEntity>) {
    Object.assign(this, partial);
  }

  // ...
}

// example.entity.ts

```

### In your service

```ts
// ...
import {
  IRequestQueryCtx,
  IRequestQueryResponse,
  RequestQueryClass,
} from 'nestjs-mongoose-service';

// ...

export class ExampleService {
  private _requestQueryClass: RequestQueryClass<ExampleDocument>;

  constructor(
    @InjectModel(Example.name)
    private _exampleModel: Model<ExampleDocument>
  ) {
    this._requestQueryClass = RequestQueryClass.create<ExampleDocument>(
      this._exampleModel,
    );
  }

  // ...
  async createOne(
    data: ExampleDto,
    opts: IRequestQueryCtx<ExampleEntity> = {},
  ): Promise<IRequestQueryResponse<ExampleEntity>> {
    try {
      return await this._requestQueryClass.createOne<
        ExampleDto,
        ExampleEntity
      >(user, opts);
    } catch (error) {
      throw new BadRequestException();
    }
  }

  // ...
}
```

### Apologies

The documentation is under development and incomplete, I'm sure that by looking at the swagger and source files you will
be able to understand how to use the library.
If you need help, please open an issue.
When I realize that the library will have a following, I will commit to completing the documentation.

## License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Licenza Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />
This work is distributed under a License <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative
Commons Attribution - Share Alike 4.0 International</a>.

<a href="https://ninjacoding.it/">
     <img src="https://raw.githubusercontent.com/carminemilieni/ninjacoding-commons/main/emoji-2.png" alt="NinjaCoding Emoji" title="Emoji" height="500" />
</a>
