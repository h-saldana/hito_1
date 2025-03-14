import swaggerJsdoc from "swagger-jsdoc"

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API REST Veterinaria Pets',
            version: '1.0.0',
            description: 'Documentation for an API REST'
        },
        servers:[
            {
                url: "http://localhost:3000/api/v1/"
            }
        ]
    },
    apis: ['swagger.yml'],
}

const openapiSpecification = swaggerJsdoc(options);

export default openapiSpecification;