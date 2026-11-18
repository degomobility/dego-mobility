import { Vehicle, IVehicle } from './vehicle.model';
import { Driver } from '../drivers/driver.model';
import { VehicleCategory, VehicleStatus } from '../../constants/vehicleCategory';

export class VehicleService {
  static async createVehicle(data: {
    driverId?: string;
    registrationNumber: string;
    make: string;
    model: string;
    year: number;
    color: string;
    category?: VehicleCategory;
  }): Promise<IVehicle> {
    const vehicle = await Vehicle.create(data);

    if (data.driverId) {
      await Driver.findByIdAndUpdate(data.driverId, { activeVehicleId: vehicle._id });
    }

    return vehicle;
  }

  static async assignDriver(
    vehicleId: string,
    driverId: string | null,
  ): Promise<IVehicle> {
    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      throw { statusCode: 404, message: 'Vehicle not found.' };
    }

    const previousDriverId = vehicle.driverId?.toString();
    if (driverId) {
      const driver = await Driver.findById(driverId).select('activeVehicleId');
      if (!driver) {
        throw { statusCode: 404, message: 'Driver not found.' };
      }

      const previousVehicleId = driver.activeVehicleId?.toString();
      if (previousVehicleId && previousVehicleId !== vehicleId) {
        await Vehicle.findByIdAndUpdate(previousVehicleId, { $unset: { driverId: 1 } });
      }
      if (previousDriverId && previousDriverId !== driverId) {
        await Driver.findByIdAndUpdate(previousDriverId, { $unset: { activeVehicleId: 1 } });
      }

      vehicle.driverId = driver._id;
      await vehicle.save();
      if (vehicle.status === VehicleStatus.ACTIVE) {
        await Driver.findByIdAndUpdate(driver._id, { $set: { activeVehicleId: vehicle._id } });
      } else {
        await Driver.findByIdAndUpdate(driver._id, { $unset: { activeVehicleId: 1 } });
      }
    } else {
      await Vehicle.findByIdAndUpdate(vehicle._id, { $unset: { driverId: 1 } });
      if (previousDriverId) {
        await Driver.findByIdAndUpdate(previousDriverId, { $unset: { activeVehicleId: 1 } });
      }
    }

    return Vehicle.findById(vehicle._id).populate({
      path: 'driverId',
      populate: { path: 'userId', select: 'name phone' },
    }) as Promise<IVehicle>;
  }

  static async getVehicles(): Promise<IVehicle[]> {
    return Vehicle.find().populate('driverId');
  }

  static async getVehicleById(id: string): Promise<IVehicle> {
    const vehicle = await Vehicle.findById(id).populate('driverId');
    if (!vehicle) {
      throw { statusCode: 404, message: 'Vehicle not found' };
    }
    return vehicle;
  }
}
