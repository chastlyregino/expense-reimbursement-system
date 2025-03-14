const userService = require(`../service/userService.js`)
const userDAO = require(`../repository/userDAO.js`)
const { request } = require("express")

const falsyUser = {
    username:`manager1@example.com`,
    password: `testpassword1234`
}

const truthyUser = {
    username:`employee1@example.com`,
    password: `testpassword1234`
}

const existingUser = {
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    username:`manager1@example.com`,
    password: `testpassword1234`,
    is_manager: true
}

describe(`Registration`, () => {
    test(`Empty password`, () => {
        falsyUser.password = ``

        expect(userService.validateUserData(falsyUser)).toBeFalsy()
    })
    // test(`Invalid username - exists`, async () => {
    //     const data = await userService.getUserByUsername(existingUser)
    //     console.log(data) //undefined
    //     expect(data).toBeInstanceOf(Object)
    // })
    test(`Successful registration`, async () => {
        const user = await userService.getUserByUsername(truthyUser)

        expect(user).toBeFalsy()
        expect(await userService.createUser(truthyUser)).toBeInstanceOf(Object)
    })
})

describe(`Login`, () => {
    test(`Invalid password`, async () => {
        falsyUser.password = `testpassword123`
        expect(await userService.validateUserCredentials(falsyUser)).toBeFalsy()
    })
    // test(`Successful Login`, async () => {
    //     truthyUser.username = `manager1@example.com`
    //     expect(await userService.validateUserCredentials(truthyUser)).toBeInstanceOf(Object)
    // })
})

/*
test registration
    empty request
    existing user
    new user

test login
    incorrect password
    correct credentials
*/
