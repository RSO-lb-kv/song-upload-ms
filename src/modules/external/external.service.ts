import { InjectService, Service } from '@nestcloud/service';
import { Injectable } from '@nestjs/common';
import { post, put } from 'request';

@Injectable()
export class ExternalService {
  constructor(@InjectService() private readonly service: Service) {
    console.log(service.getServiceNodes('music-catalog'));
  }

  post<T>(service: string, path: string, body: any): Promise<T> {
    return new Promise((resolve, reject) => {
      post(
        this.getService(service) + path,
        { body, json: true },
        (err, res, body) => {
          if (err) return reject(err);
          if (res.statusCode > 204) return reject(body);
          return resolve(body);
        },
      );
    });
  }

  put<T>(service: string, path: string, body: any): Promise<T> {
    return new Promise((resolve, reject) => {
      put(
        this.getService(service) + path,
        { body, json: true },
        (err, res, body) => {
          if (err) return reject(err);
          if (res.statusCode > 204) return reject(body);
          return resolve(body);
        },
      );
    });
  }

  private getService(service: string): string {
    const services = this.service
      .getServiceNodes(service)
      .filter(s => s.status === 'passing');

    if (!services.length) {
      throw new Error('No healthy services');
    }

    const url = services[Math.floor(Math.random() * services.length)].id;
    return 'http://' + url;
  }
}
