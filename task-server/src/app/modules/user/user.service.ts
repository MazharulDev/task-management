import { Prisma, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { paginationHelpers } from '../../../helpers/paginationHelper';
import { IGenericResponse } from '../../../interfaces/common';
import { IPaginationOptions } from '../../../interfaces/pagination';
import prisma from '../../../shared/prisma';
import { userSearchableFields } from './user.constants';
import { IUserFilterRequest } from './user.interface';

const createUser = async (data: User): Promise<User> => {
  // Check if user already exists
  const isExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (isExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds)
  );

  data.password = hashedPassword;

  // Set default role if not provided
  if (!data.role) {
    data.role = 'USER' as any;
  }

  const result = await prisma.user.create({
    data,
  });

  return result;
};

const getAllUsers = async (
  filters: IUserFilterRequest,
  options: IPaginationOptions
): Promise<IGenericResponse<User[]>> => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map(key => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getSingleUser = async (id: string): Promise<User | null> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return result;
};

const updateUser = async (
  id: string,
  payload: Partial<User>
): Promise<User> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // If password is being updated, hash it
  if (payload.password) {
    payload.password = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)
    );
  }

  const updatedUser = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  return updatedUser;
};

const deleteUser = async (id: string): Promise<User> => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const deletedUser = await prisma.user.delete({
    where: {
      id,
    },
  });

  return deletedUser;
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
