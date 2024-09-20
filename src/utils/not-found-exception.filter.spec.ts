import { NotFoundExceptionFilter } from './';
import { NotFoundException } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

describe('NotFoundExceptionFilter', () => {
  let filter: NotFoundExceptionFilter;
  let mockResponse: Partial<Response>;
  let mockArgumentsHost: Partial<ArgumentsHost>;

  beforeEach(() => {
    filter = new NotFoundExceptionFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
      }),
    };
  });

  it('should set status to 404 and send "0"', () => {
    const exception = new NotFoundException();
    filter.catch(exception, mockArgumentsHost as ArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.send).toHaveBeenCalledWith('0');
  });
});
