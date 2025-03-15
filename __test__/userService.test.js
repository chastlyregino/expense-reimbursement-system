jest.mock(`../repository/userDAO.js`, () => {
    return {
        createUser: jest.fn(),
        getUser: jest.fn(),
        updateUser: jest.fn(),
        getUserByUsername: jest.fn(),
        // Add other DAO functions as needed
      }
})

jest.mock(`bcryptjs`, () => ({
    hash: jest.fn(),//.mockResolvedValue(`mockedHashedPassword`),
    compare: jest.fn() // Mock compare if needed
}))

const bcrypt = require(`bcryptjs`)
const userService = require(`../service/userService.js`)
const userDAO  = require(`../repository/userDAO.js`)


const falsyUser = {
    username:`manager1@example.com`,
    password: `testpassword1234`
}

const truthyUser = {
    username:`employee1@example.com`,
    password: `testpassword1234`
}

// const createdTruthyUser = {
//     username:`employee1@example.com`,
//     password: `mockedHashedPassword`,
// }

const existingUser = {
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    username:`manager1@example.com`,
    password: `testpassword1234`,
    is_manager: true
}

describe(`Registration`, () => {
    beforeEach(() => {
        userDAO.getUserByUsername.mockImplementation(() => Promise.resolve())
        userDAO.getUserByUsername.mockResolvedValue([existingUser])
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
    
    test(`Empty password`, () => {
        falsyUser.password = ``
        expect(userService.validateUserData(falsyUser)).toBeFalsy()
    })
    test(`Invalid username - exists`, async () => {
        const user = await userService.getUserByUsername(falsyUser)
        expect(user).toBeTruthy()
        expect(user).toEqual(existingUser)
    })
    test(`Successful registration`, async () => {
        const user = await userService.getUserByUsername(truthyUser)
        expect(user).toBeTruthy()
        expect(user).toEqual(existingUser)

        userDAO.createUser.mockImplementation(() => Promise.resolve())
        userDAO.createUser.mockResolvedValue(truthyUser)
        bcrypt.hash.mockResolvedValue(`mockedHashedPassword`)

        const newUser = await userService.createUser(truthyUser)
        expect(user).toBeTruthy()
        expect(newUser).toEqual(truthyUser)
    })
})

describe(`Login`, () => {
    beforeEach(() => {
        userDAO.getUserByUsername.mockImplementation(() => Promise.resolve())
        userDAO.getUserByUsername.mockResolvedValue([existingUser])
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test(`Invalid password`, async () => {
        falsyUser.password = `testpassword123`
        bcrypt.compare.mockResolvedValue(false)

        const user = await userService.validateUserCredentials(falsyUser)
        expect(user).toBeFalsy()
    })
    test(`Successful Login`, async () => {
        truthyUser.username = `manager1@example.com`
        bcrypt.compare.mockResolvedValue(true)

        const user = await userService.validateUserCredentials(truthyUser)
        expect(user).toBeTruthy()
        expect(user).toEqual(existingUser)
    })
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
