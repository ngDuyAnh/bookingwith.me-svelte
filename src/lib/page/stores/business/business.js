import {get, writable} from 'svelte/store';
import {Service, ServiceGroup} from "$lib/api/initialize_functions/Business.js";
import {initializeBusiness} from "$lib/api/api_server/api_endpoints/business-portal/api.js";

export const business = writable(undefined);

export function getBusinessID()
{
    const businessValue = get(business);
    return businessValue.businessInfo.businessID;
}

export function getEmployee(id) {
    const businessValue = get(business);

    // Check if businessValue is defined and has an employeeList
    if (businessValue && businessValue.employeeList) {
        // Use the find method to look for the employee with the matching id
        const employee = businessValue.employeeList.find(employee => employee.id === id);

        // If an employee is found, return it; otherwise, return null explicitly
        return employee || null;
    }

    // Return null if businessValue or businessValue.employeeList is undefined
    return null;
}

export function importNailSalonServices()
{
    let importServiceGroupList = [
        {
            ...ServiceGroup(),
            serviceGroupName: "Add-on",
            multiselect: true,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Nail arts",
                    serviceCost: 5,
                    serviceTimeLength: 15,
                    description: "(Children 5 years or under get free designs)",

                    showPlus: true,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Shellac take off",
                    serviceCost: 2,
                    serviceTimeLength: 15,
                    description: "Removal of old shellac nail polish.",

                    showPlus: true,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Powder/Gel Take Off",
                    serviceCost: 12,
                    serviceTimeLength: 30,
                    description: "Removal of old shellac nail polish.",

                    showPlus: true,
                    showOnlineBookingPage: true
                }
            ]
        },

        {
            ...ServiceGroup(),
            serviceGroupName: "Manicures",
            description: "For your hands.",
            multiselect: false,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Regular manicure",
                    serviceCost: 25,
                    serviceTimeLength: 30,
                    description: "A full hand treatment including soaking, trimming, shaping, and buffing of nails, cuticle care, and a hot towel massage. Optional regular polish, finishing with lotion and cuticle oil.",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Shellac manicure",
                    serviceCost: 35,
                    serviceTimeLength: 45,
                    description: "A full hand treatment like a regular manicure, but enhanced with a selection of Shellac colors that are UV-cured for quick drying and lasting durability.",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Fingernail trim",
                    serviceCost: 10,
                    serviceTimeLength: 10,
                    description: "Keep your fingernails neat and tidy with a professional trim. Includes trimming, shaping, buffing for a polished look.",

                    showPlus: false,
                    showOnlineBookingPage: false
                },

                {
                    ...Service(),
                    serviceName: "Regular polish change hands",
                    serviceCost: 15,
                    serviceTimeLength: 15,
                    description: "Nail care like fingernail trim and a regular color finish.",

                    showPlus: false,
                    showOnlineBookingPage: false
                },

                {
                    ...Service(),
                    serviceName: "Shellac polish change hands",
                    serviceCost: 25,
                    serviceTimeLength: 30,
                    description: "Nail care like fingernail trim, but enhanced with a selection of shellac colours that are UV-cured for quick drying and lasting durability.",

                    showPlus: false,
                    showOnlineBookingPage: false
                }
            ]
        },

        {
            ...ServiceGroup(),
            serviceGroupName: "Nail Extensions",
            description: "Extend and shape your nails for a stylish and durable finish.",
            multiselect: false,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Fill for nail extensions",
                    serviceCost: 50,
                    serviceTimeLength: 75,
                    description: "Recommended every 2-3 weeks for nail extensions.",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                },

                {
                    ...Service(),
                    serviceName: "Acrylic extensions new set",
                    serviceCost: 55,
                    serviceTimeLength: 75,
                    description: "Classic full set for durable nail extensions using a liquid monomer and powder polymer mixture applied to natural nails and tips/forms. Durable, long-lasting, and requiring fills every 2-3 weeks.",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                },

                {
                    ...Service(),
                    serviceName: "LCN Gel extensions new set",
                    serviceCost: 70,
                    serviceTimeLength: 75,
                    description: "A durable and flexible option for nail extensions. Gel is applied over natural nails and tips/forms, then cured under a UV or LED lamp. Durable, flexible, and requiring fills every 2-3 weeks.",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                },

                {
                    ...Service(),
                    serviceName: "Dip powder extensions new set",
                    serviceCost: 55,
                    serviceTimeLength: 75,
                    description: "A strong, lightweight, and flexible option for nail extensions. Nails are coated with a bonding agent, then dipped into a colored powder, and hardens into a durable layer. Strong, lightweight, flexible, and requiring fills every 2-3 weeks.",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                }
            ]
        },

        {
            ...ServiceGroup(),
            serviceGroupName: "Pedicures",
            description: "For your feet.",
            multiselect: false,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Regular pedicure",
                    serviceCost: 35,
                    serviceTimeLength: 30,
                    description: "A full foot treatment including toenail trimming, shaping, and non-nipper cuticle care. Concludes with a relaxing foot massage and a hot towel wrap. Optional regular polish, finishing with lotion and cuticle oil.",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Shellac pedicure",
                    serviceCost: 45,
                    serviceTimeLength: 45,
                    description: "A full foot treatment like a regular pedicure, but enhanced with a selection of Shellac colors that are UV-cured for quick drying and lasting durability.",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Regular pedicure with sugar scrub",
                    serviceCost: 40,
                    serviceTimeLength: 40,
                    description: "A full foot treatment like a regular pedicure, but enhanced with sugar scrub.",

                    showPlus: false,
                    showOnlineBookingPage: false,
                },

                {
                    ...Service(),
                    serviceName: "Deluxe spa pedicure",
                    serviceCost: 50,
                    serviceTimeLength: 50,
                    description: "A full foot treatment like a shellac pedicure, but enhanced with sugar scrub and 15 minutes massage.",

                    showPlus: false,
                    showOnlineBookingPage: false,
                },

                {
                    ...Service(),
                    serviceName: "Toenail trim",
                    serviceCost: 12,
                    serviceTimeLength: 10,
                    description: "Keep your toenails neat and tidy with a professional trim. Includes shaping and smoothing for a polished look.",

                    showPlus: false,
                    showOnlineBookingPage: false,
                },

                {
                    ...Service(),
                    serviceName: "Toe care",
                    serviceCost: 30,
                    serviceTimeLength: 20,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: false,
                },

                {
                    ...Service(),
                    serviceName: "Regular polish change toes",
                    serviceCost: 17,
                    serviceTimeLength: 15,
                    description: "Nail care like toenail trim and a regular color finish.",

                    showPlus: false,
                    showOnlineBookingPage: false,
                },

                {
                    ...Service(),
                    serviceName: "Shellac polish change toes",
                    serviceCost: 30,
                    serviceTimeLength: 30,
                    description: "Nail care like toenail trim, but enhanced with a selection of shellac colours that are UV-cured for quick drying and lasting durability.",

                    showPlus: false,
                    showOnlineBookingPage: false,
                }
            ]
        },

        {
            ...ServiceGroup(),
            serviceGroupName: "Waxing",
            description: "",
            multiselect: true,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Eyebrow",
                    serviceCost: 15,
                    serviceTimeLength: 15,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Upper lip",
                    serviceCost: 8,
                    serviceTimeLength: 5,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Chin",
                    serviceCost: 8,
                    serviceTimeLength: 5,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Face",
                    serviceCost: 35,
                    serviceTimeLength: 30,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Underarms",
                    serviceCost: 17,
                    serviceTimeLength: 20,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Full legs",
                    serviceCost: 65,
                    serviceTimeLength: 45,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Half legs",
                    serviceCost: 35,
                    serviceTimeLength: 30,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Full arms",
                    serviceCost: 35,
                    serviceTimeLength: 30,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Half arms",
                    serviceCost: 20,
                    serviceTimeLength: 20,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Back",
                    serviceCost: 45,
                    serviceTimeLength: 45,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Bikini",
                    serviceCost: 25,
                    serviceTimeLength: 30,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Brazilian",
                    serviceCost: 50,
                    serviceTimeLength: 45,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                }
            ]
        },

        {
            ...ServiceGroup(),
            serviceGroupName: "Massage",
            description: "",
            multiselect: true,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Foot massage (30 minutes)",
                    serviceCost: 40,
                    serviceTimeLength: 30,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Half leg massage with exfoliation (30 minutes)",
                    serviceCost: 40,
                    serviceTimeLength: 30,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Body massage (30 minutes)",
                    serviceCost: 40,
                    serviceTimeLength: 30,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Body massage (60 minutes)",
                    serviceCost: 80,
                    serviceTimeLength: 60,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Foot sugar scrub",
                    serviceCost: 5,
                    serviceTimeLength: 5,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                }
            ]
        },

        {
            ...ServiceGroup(),
            serviceGroupName: "Fixes",
            description: "Minor fixes within about a week after the initial service will be provided free of charge.",
            multiselect: false,
            showOnlineBookingPage: false,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Regular or shellac colour chipped",
                    serviceCost: 0,
                    serviceTimeLength: 5,
                    description: "",

                    showPlus: false,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Nail extensions fix",
                    serviceCost: 0,
                    serviceTimeLength: 10,
                    description: "Fixes chips, lifts, and other issues with acrylic, gel, or powder dip extensions.",

                    showPlus: false,
                    showOnlineBookingPage: true
                }
            ]
        }
    ];

    // Add the serviceGroupList to the business and submit the changes to the backend
    const businessValue = get(business);
    businessValue.serviceGroupList =
        [...businessValue.serviceGroupList, ...importServiceGroupList];

    // Request the server to update
    initializeBusiness(businessValue)
        .then(response => {
            business.set(response);
        })
        .catch(error => {
            console.error('Failed to update the business:', error);
        });
}

export function importHairSalonServices()
{
    let importServiceGroupList = [
        {
            ...ServiceGroup(),
            serviceGroupName: "Haircut",
            description: "Offering a range of essential grooming services, ensuring you look your best with every visit.",
            multiselect: false,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Men",
                    serviceCost: 21,
                    serviceTimeLength: 30,
                    description: "From maintaining a clean and straightforward style, to a customized approach or traditional haircuts.",

                    showPlus: true,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Women",
                    serviceCost: 25,
                    serviceTimeLength: 30,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Children",
                    serviceCost: 20,
                    serviceTimeLength: 30,
                    description: "(Age 12 & under)",

                    showPlus: true,
                    showOnlineBookingPage: true
                }
            ]
        },

        {
            ...ServiceGroup(),
            serviceGroupName: "Styling",
            description: "",
            multiselect: false,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Blow dry",
                    serviceCost: 10,
                    serviceTimeLength: 20,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Round brush",
                    serviceCost: 20,
                    serviceTimeLength: 20,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Straight",
                    serviceCost: 30,
                    serviceTimeLength: 20,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Curl",
                    serviceCost: 35,
                    serviceTimeLength: 20,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                }
            ]
        },

        {
            ...ServiceGroup(),
            serviceGroupName: "Shampoo",
            description: "",
            multiselect: false,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Short hair",
                    serviceCost: 6,
                    serviceTimeLength: 15,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Medium & long hair",
                    serviceCost: 12,
                    serviceTimeLength: 15,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                },

                {
                    ...Service(),
                    serviceName: "Deep conditioning treatment",
                    serviceCost: 45,
                    serviceTimeLength: 120,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                }
            ]
        },

        {
            ...ServiceGroup(),
            serviceGroupName: "Colour",
            description: "",
            multiselect: false,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Retouch",
                    serviceCost: 85,
                    serviceTimeLength: 120,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                },

                {
                    ...Service(),
                    serviceName: "Solid colour",
                    serviceCost: 100,
                    serviceTimeLength: 180,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                },

                {
                    ...Service(),
                    serviceName: "Highlight",
                    serviceCost: 120,
                    serviceTimeLength: 210,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                }
            ]
        },

        {
            ...ServiceGroup(),
            serviceGroupName: "Perm",
            description: "",
            multiselect: false,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Partial perm",
                    serviceCost: 85,
                    serviceTimeLength: 120,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                },

                {
                    ...Service(),
                    serviceName: "Basic perm",
                    serviceCost: 110,
                    serviceTimeLength: 120,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                },

                {
                    ...Service(),
                    serviceName: "Spiral perm",
                    serviceCost: 130,
                    serviceTimeLength: 120,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                },

                {
                    ...Service(),
                    serviceName: "Partial straighten",
                    serviceCost: 100,
                    serviceTimeLength: 180,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                },

                {
                    ...Service(),
                    serviceName: "Full head straighten",
                    serviceCost: 210,
                    serviceTimeLength: 240,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true,

                    highlight: true
                }
            ]
        },

        {
            ...ServiceGroup(),
            serviceGroupName: "Waxing",
            description: "",
            multiselect: true,
            showOnlineBookingPage: true,
            serviceList: [
                {
                    ...Service(),
                    serviceName: "Eyebrow",
                    serviceCost: 12,
                    serviceTimeLength: 15,
                    description: "",

                    showPlus: true,
                    showOnlineBookingPage: true
                }
            ]
        }
    ];

    // Add the serviceGroupList to the business and submit the changes to the backend
    const businessValue = get(business);
    businessValue.serviceGroupList =
        [...businessValue.serviceGroupList, ...importServiceGroupList];

    // Request the server to update
    initializeBusiness(businessValue)
        .then(response => {
            business.set(response);
        })
        .catch(error => {
            console.error('Failed to update the business:', error);
        });
}
