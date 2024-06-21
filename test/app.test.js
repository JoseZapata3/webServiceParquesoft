const req = require('supertest');

const app = require('../src/app');
const mongoose = require('mongoose');

describe("endpoints-libros",()=>{
    test("Deberia obtener una lista de libros",async ()=>{
        const res = await req(app)
            .get('/api/libros')
            .set('authorization','tokenSecreto');
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test("Deberia crearse un libro",async  ()=>{
        const res = await req(app)
            .post('/api/libros')
            .send({
                "titulo":"test",
                "autor":"dev"
            })
            .set('authorization','tokenSecreto');

            expect(res.statusCode).toEqual(200);
            expect(res.body.titulo).toEqual('test');
    });

     afterAll(async ()=>{
        await mongoose.connection.close()
    })
});