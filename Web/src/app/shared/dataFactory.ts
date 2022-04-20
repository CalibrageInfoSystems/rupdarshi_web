import { InjectionToken } from '@angular/core';

export let DATA_CONFIG = new InjectionToken('dataFactory');

export const DataFactory = {

    typecddmt:{
        classType:1
    },
    RoleIds: {
        superAdmin:1,
        storeAdminL:2,
        deliveryAgent:3,
        customer:4
    },

    OrderStatus: {
        Processed:1,
        InTransit:2,
        Delivered:3,
        Rejected:4
    }
};


