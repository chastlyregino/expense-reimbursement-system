const { request } = require(`express`)

jest.mock(`../repository/userDAO.js`, () => {
    return {
        createUser: jest.fn(),
        getUser: jest.fn(),
        getUsers: jest.fn(),
        deleteUser: jest.fn(),
        updateUser: jest.fn(),
        getUserByUsername: jest.fn(),
        // Add other DAO functions as needed
      }
})

const userService = require(`../service/userService.js`)
const userDAO  = require(`../repository/userDAO.js`)

//const userService = new userService()

// userDAO.prototype.saveData.mockImplementation(() => Promise.resolve())
// userDAO.prototype.getData.mockResolvedValue([existingUser])


const falsyUser = {
    username:`manager1@example.com`,
    password: `testpassword1234`
}

const truthyUser = {
    username:`employee1@example.com`,
    password: `testpassword1234`
}

const createdTruthyUser = {
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    username:`employee1@example.com`,
    password: `testpassword1234`,
    is_manager: false
}

const existingUser = {
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    username:`manager1@example.com`,
    password: `testpassword1234`,
    is_manager: true
}

describe(`Registration`, () => {
    // beforeEach(() => {
    //     userDAO.getUserByUsername.mockImplementation(() => Promise.resolve())
    //     userDAO.getUserByUsername.mockResolvedValue(existingUser)
    // })

    // afterEach(() => {
    //     jest.clearAllMocks()
    // })
    
    // test(`Empty password`, () => {
    //     falsyUser.password = ``

    //     expect(userService.validateUserData(falsyUser)).toBeFalsy()
    // })
    test(`Invalid username - exists`, async () => {
        userDAO.getUserByUsername.mockImplementation(() => Promise.resolve())
        userDAO.getUserByUsername.mockResolvedValue(existingUser)
        const user = await userService.getUserByUsername(falsyUser)
        expect(user).toBeTruthy()
        expect(user).toEqual(existingUser)
    })
    // test(`Successful registration`, async () => {
    //     const user = await userService.getUserByUsername(truthyUser)
    //     expect(user).toBeTruthy()
    //     expect(user).toEqual(existingUser)

    //     userDAO.createUser.mockImplementation(() => Promise.resolve())
    //     userDAO.createUser.mockResolvedValue([existingUser])

    //     const newUser = await userService.createUser(truthyUser)
    //     expect(newUser).toEqual(createdTruthyUser)
    // })
})

describe(`Login`, () => {
    let user
    // userDAO.getUserByUsername.mockImplementation(() => Promise.resolve())
    // userDAO.getUserByUsername.mockResolvedValue([existingUser])

    // test(`Invalid password`, async () => {
    //     falsyUser.password = `testpassword123`
    //     user = await userService.validateUserCredentials(falsyUser)
    //     expect(user).toBeFalsy()
    //     expect(userDAO.getUserByUsername).toHaveBeenCalledWith(1)
    // })
    // test(`Successful Login`, async () => {
    //     truthyUser.username = `manager1@example.com`
    //     user = await userService.validateUserCredentials(truthyUser)
    //     expect(user).toEqual(existingUser)
    //     expect(userDAO.getUserByUsername).toHaveBeenCalledWith(1)
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
