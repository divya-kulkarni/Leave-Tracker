const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../index");

chai.should();

chai.use(chaiHttp);

describe('Employee related APIs' ,()=>{

    /**
     * Post method to authenticate login
     */

    describe('POST /login',()=>{
        it('It should return succes TRUE for VALID input' ,(done)=>{
            const body = {
                employee_id:'101',
                pass:'123'
            }
            chai.request(server)
                .post('/login')
                .send(body)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.have.property('success').eq(true);
                    res.body.should.have.property('message').eq('Login success');
                done();
                })
        });

        it('It should return succes FALSE for INVALID id' ,(done)=>{
            const body = {
                employee_id:'121',
                pass:'123'
            }
            chai.request(server)
                .post('/login')
                .send(body)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.have.property('success').eq(false);
                done();
                })
        });

        it('It should return succes FALSE for WRONG password' ,(done)=>{
            const body = {
                employee_id:'101',
                pass:'122133'
            }
            chai.request(server)
                .post('/login')
                .send(body)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.have.property('success').eq(false);
                    res.body.should.have.property('message').eq('Incorrect password, try again');
                done();
                });
        });

    });

    /**
     * POST method to add leave
     */

    describe('POST /addLeave',()=>{

        it('It should add a leave for given employee wihtout end date',(done)=>{
            const body = {
                startDate:'2021/03/26',
                endDate:null,
                employee_id:107
            }
            chai.request(server)
                .post('/addLeave')
                .send(body)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.have.property('data');
                done();
                });
        });

        it('It should add a leave for given employee with end date',(done)=>{
            const body = {
                startDate:'2021/03/28',
                endDate:'2021/03/29',
                employee_id:107
            }
            chai.request(server)
                .post('/addLeave')
                .send(body)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.have.property('data');
                done();
                });
        });

        it('It should return ERROR when invalid input is sent',(done)=>{
            const body = {
                startDate:null,
                endDate:null,
                employee_id:109
            }
            chai.request(server)
                .post('/addLeave')
                .send(body)
                .end((err,res)=>{
                    res.should.have.status(500);
                    res.body.should.have.property('error').eq('Something failed!');
                done();
                });
        });

    });

});

// describe('Employees related API',()=>{

//     describe('GET /employee',()=>{

//         it('')
//     });

// });