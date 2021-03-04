const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../index");

chai.should();

chai.use(chaiHttp);

describe('Employee related POST APIs' ,()=>{

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

        it('It should return ERROR when invalid start date is sent',(done)=>{
            const body = {
                startDate:null,
                endDate:null,
                employee_id:101
            }
            chai.request(server)
                .post('/addLeave')
                .send(body)
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.have.property('error').eq('Invalid Start Date!');
                done();
                });
        });

        it('It should return ERROR when invalid employee_id is sent',(done)=>{
            const body = {
                startDate:'2021/03/28',
                endDate:null,
                employee_id:109
            }
            chai.request(server)
                .post('/addLeave')
                .send(body)
                .end((err,res)=>{
                    res.should.have.status(400);
                    res.body.should.have.property('error').eq('Something failed!');
                done();
                });
        });


    });

});

function checkDup(data){
    var len = data.length,tmp={};

    while(len--)
    {
        var val = data[len];
        if(tmp[JSON.stringify(val)])
            return false;
        tmp[JSON.stringify(val)] =true;
    }
    return false;
}

describe('Employees related API',()=>{

    describe('GET /employee',()=>{

        it('It should return an array of employees',(done)=>{
            chai.request(server)
                .get('/employee')
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                done();
                });
        });

        it('It should return array of employees having employee details',(done)=>{
            chai.request(server)
                .get('/employee')
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body[0].should.have.property('employee_id');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('count');
                    res.body[0].should.have.property('leaves');
                done();
                });
        });

        it('It should return array of employees having employee leaves in an array',(done)=>{
            chai.request(server)
                .get('/employee')
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body[0].should.have.property('leaves');
                    res.body[0].leaves.should.be.a('array');
                done();
                });
        });

        it('It should return an array of distinct employees',(done)=>{
            chai.request(server)
                .get('/employee')
                .end((err,res)=>{
                    res.should.have.status(200);
                    checkDup(res).should.be.eq(false);
                done();
                });
        });

    });

});

describe('Team realted APIs',()=>{

    describe('GET /team',()=>{

        it('It should return an array of teams',(done)=>{
            chai.request(server)
                .get('/team')
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                done();
                });
        });

        it('It should return array of teams having team details',(done)=>{
            chai.request(server)
                .get('/team')
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body[0].should.have.property('team_name');
                    res.body[0].should.have.property('threshold');
                    res.body[0].should.have.property('emp');
                done();
                });
        });

        it('It should return array of teams having list of employees in an array',(done)=>{
            chai.request(server)
                .get('/team')
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body[0].should.have.property('emp');
                    res.body[0].emp.should.be.a('array');
                done();
                });
        });

        it('It should return an array of distinct teams',(done)=>{
            chai.request(server)
                .get('/team')
                .end((err,res)=>{
                    res.should.have.status(200);
                    checkDup(res).should.be.eq(false);
                done();
                });
        });
    });

    describe('GET /teamLeave',()=>{
        it('It should return an array of teams',(done)=>{
            chai.request(server)
                .get('/teamLeave')
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                done();
                });
        });

        it('It should return array of teams having team details and employee leaves',(done)=>{
            chai.request(server)
                .get('/teamLeave')
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body[0].should.have.property('team_id');
                    res.body[0].should.have.property('threshold');
                    res.body[0].should.have.property('name');
                    res.body[0].should.have.property('emp_count');
                    res.body[0].should.have.property('leaves');
                done();
                });
        });

        it('It should return array of teams having list of leaves of employees in an array',(done)=>{
            chai.request(server)
                .get('/teamLeave')
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body[0].should.have.property('leaves');
                    res.body[0].leaves.should.be.a('array');
                done();
                });
        });

        it('It should return an array of distinct teams',(done)=>{
            chai.request(server)
                .get('/teamLeave')
                .end((err,res)=>{
                    res.should.have.status(200);
                    checkDup(res).should.be.eq(false);
                done();
                });
        });
    });

});