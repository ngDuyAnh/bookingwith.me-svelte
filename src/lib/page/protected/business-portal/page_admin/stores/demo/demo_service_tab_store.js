import { writable } from 'svelte/store';

export const serviceGroupListDemo = writable([
    {
        "id": 0,
        "serviceGroupName": "Beauty Services",
        "description": "A wide range of beauty services including haircuts, styling, facials, and more.",
        "serviceList": [
            {
                "id": 0,
                "serviceName": "Haircut",
                "serviceCost": 25.0,
                "serviceTimeLength": 30,
                "description": "A professional haircut tailored to individual preferences.",
                "employeeList": ["Alice", "Bob"]
            },
            {
                "id": 1,
                "serviceName": "Facial",
                "serviceCost": 40.02,
                "serviceTimeLength": 45,
                "description": "A rejuvenating facial treatment for glowing skin.",
                "employeeList": ["Carol", "Dave"]
            }
        ]
    },
    {
        "id": 1,
        "serviceGroupName": "Wellness Services",
        "description": "Health and wellness services to relax and rejuvenate your body and mind.",
        "serviceList": [
            {
                "id": 2,
                "serviceName": "Massage",
                "serviceCost": 60.25,
                "serviceTimeLength": 60,
                "description": "A deep tissue massage to alleviate muscle stress.",
                "employeeList": ["Eve", "Frank"]
            },
            {
                "id": 3,
                "serviceName": "Yoga",
                "serviceCost": 20.50,
                "serviceTimeLength": 45,
                "description": "A group yoga session to improve flexibility and peace of mind.",
                "employeeList": ["Grace", "Hank"]
            }
        ]
    }
]);
