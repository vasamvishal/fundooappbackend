

process.env.NODE_ENV = 'mochaTest';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const fs = require('fs');

chai.should();
chai.use(chaiHttp);
console.log("test");

const testJson = fs.readFileSync('/home/admin1/Documents/fundoo-app/backend/test/mocha.json','utf-8');
console.log(testJson);
const readJson = JSON.parse(testJson);
console.log(readJson);

console.log(readJson.login[0].Empty);
describe('Login Api',() => {
    it('it should not be empty',(done) => {
        chai.request(server)
            .post('/login')
            .send(readJson.login[0].Empty)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                done()
            })
    })

    it('it mail is empty',(done) => {
        chai.request(server)
            .post('/login')
            .send(readJson.login[0].missing)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                
                done()
            })
    })
    it('if password is empty',(done) => {
        chai.request(server)
            .post('/login')
            .send(readJson.login[0].missingpassword)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                done()
            })
    })

    it('if isemail is false',(done) => {
        chai.request(server)
            .post('/login')
            .send(readJson.login[0].isemailfalse)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                done()
            })
    })

    it('if password is wrong',(done) => {
        chai.request(server)
            .post('/login')
            .send(readJson.login[0].wrongentry)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                done()
            })
    })

    it('if everything is right',(done) => {
        chai.request(server)
            .post('/login')
            .send(readJson.login[0].properEntery)
            .end((req,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done()
            })
    })

    it('if not registered entry',(done) => {
        chai.request(server)
            .post('/login')
            .send(readJson.login[0].notregisteredentry)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.be.a('object').eql({"errors":{message:"User not found"},"sucess":false});
                done()
            })
    })
})

describe('registration Api',() => {
    it('it should not be empty',(done) => {
        chai.request(server)
            .post('/register')
            .send(readJson.register[0].Empty)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                done()
            })
    })

    
    it('if firstname is empty',(done) => {
        chai.request(server)
            .post('/register')
            .send(readJson.register[0].missing)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                
                done()
            })
    })
    it('if lastname is empty',(done) => {
        chai.request(server)
            .post('/register')
            .send(readJson.register[0].missinglastName)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                
                done()
            })
    })
    
    it('if email is empty',(done) => {
        chai.request(server)
            .post('/register')
            .send(readJson.register[0].missingemail)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                done()
            })
    })

    it('if password is empty',(done) => {
        chai.request(server)
            .post('/register')
            .send(readJson.register[0].missingpassword)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.have.property('errors');
                done()
            })
    })

    it('if user is registered',(done) => {
        chai.request(server)
            .post('/register')
            .send(readJson.register[0].registeredentry)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.be.a('object').eql({message: "Email already registered"})
                done()
            })
    })

    it('if everything is right',(done) => {
        chai.request(server)
            .post('/register')
            .send(readJson.register[0].properEntery)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                done()
            })
    })

    it('if password is wrong',(done) => {
        chai.request(server)
            .post('/register')
            .send(readJson.register[0].wrongpassword)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                done()
            })
    })

    it('if email is wrong ',(done) => {
        chai.request(server)
            .post('/register')
            .send(readJson.register[0].wrongemail)
            .end((req,res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                done()
            })
    })
})
