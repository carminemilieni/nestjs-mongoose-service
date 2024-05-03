[![npm version](https://badge.fury.io/js/nestjs-mongoose-service.svg)](https://badge.fury.io/js/nestjs-mongoose-service)

<a href="https://ninjacoding.it/">
     <img src="https://raw.githubusercontent.com/carminemilieni/ninjacoding-commons/main/ninjacoding-primary-logo.svg" alt="NinjaCoding logo" title="NinjaCoding" height="60" />
</a>

# nestjs-mongoose-service

⭐️ Aggiungi una stella su GitHub: mi motiva molto!

> Questo progetto nasce dall'assenza di librerie che lavorano in modo decente con Mongoose.
> È una libreria NestJS che fornisce classi e metodi per operazioni CRUD facili con modelli Mongoose.
>
>
> Con questo progetto potrai accettare query complesse, paginare i risultati e selezionare i campi, tutto pienamente
> compatibile con OpenAPI e la generazione dello Swagger.

## Pre-requisiti

Questo progetto è stato sviluppato
utilizzando NodeJS v20.9.0, NPM v10.1.0 o Yarn v1.22.22 e NestJS v10.0.0.

- [Node](http://nodejs.org/) (v20.9.0)
- [NPM](https://npmjs.org/) (v10.1.0)
- [YARN](https://yarnpkg.com/) (v1.22.22)
- [NestJS](https://nestjs.com/) (v10.0.0)

Dipendenze di progetto:

- @nestjs/common: ^10.0.0
- @nestjs/config: ^3.2.0
- @nestjs/core: ^10.0.0
- @nestjs/mongoose: ^10.0.4
- @nestjs/platform-express: ^10.0.0
- @nestjs/swagger: ^7.3.0
- class-transformer: ^0.5.1
- class-validator: ^0.14.1
- mongoose: ^8.2.3

Non garantisco la retro-compatibilità con versioni precedenti di NodeJS e NPM.
Eventuali richieste sono ben accette.

## Sommario

- [Installazione](#installazione)
- [Utilizzo](#utilizzo)
    - [Creare Controller, Service ed Entity](#creare-controller-service-ed-entity)
    - [Nel tuo service](#nel-tuo-service)
- [Scuse](#scuse)
- [Licenza](#licenza)

## Installazione

**PRIMA DI INSTALLARE:** per favore leggi i [pre-requisiti](#pre-requisiti)

A seconda del package manager che preferisci, puoi installare la libreria con npm o yarn.

```shell
npm install -S nestjs-mongoose-service
```

Oppure se preferisci usare Yarn:

```shell
yarn add nestjs-mongoose-service
```

## Utilizzo

### Creare Controller, Service ed Entity

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

Nel tuo entity file (facoltativo)

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

### Nel tuo service

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

### Scuse

La documentazione è in via di sviluppo e incompleta, sono sicuro che guardando lo swagger e i file sorgente
sarai in grado di capire come utilizzare la libreria.
Se hai bisogno di aiuto, per favore apri una issue.
Quando mi renderò conto che la libreria avrà un seguito, mi impegnerò a completare la documentazione.

## Licenza

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Licenza Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />
This work is distributed under a License <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative
Commons Attribution - Share Alike 4.0 International</a>.

<a href="https://ninjacoding.it/">
     <img src="https://raw.githubusercontent.com/carminemilieni/ninjacoding-commons/main/emoji-2.png" alt="NinjaCoding Emoji" title="Emoji" height="500" />
</a>
