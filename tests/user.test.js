const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')


beforeEach(setupDatabase)

test('Deve criar um novo usuário', async () => {
    const response = await request(app).post('/users').send({
        name: 'Erick',
        email: 'erick@exemplo.com.br',
        password: 'MyPass777!'
    }).expect(201)

    // Verificar se o banco de dados foi alterado corretamente
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // verificar se o conteudo de 'response' corresponde ao dados
    expect(response.body).toMatchObject({
        user: {
            name:'Erick',
            email: 'erick@exemplo.com.br'
        },
        token:user.tokens[0].token
    })
    // expect(user.password).not.toBe('senhapadrao')
})

test('Deve logar usuário existente', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Não deve logar um usuário não cadastrado', async () => {
        await request(app).post('/users/login').send({
            email: userOne.email,
            password: 'senhaincorreta'
        }).expect(400)
})

test('Deve obter o perfil do usuário', async () => {
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Não deve obter o perfil de um usuário não autenticado', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Deve deletar a conta do usuário', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId)
        expect(user).toBeNull()
})

test('Não deve deletar a conta do usuário não autenticado', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test('Deve carregar a imagem do avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Deve atualizar os campos válidos', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Lucas'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual('Lucas')
})

test('Não deve atualizar campos inválidos', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            Location: 'Phily'
        })
        .expect(400)
})


// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated
