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
    hash: jest.fn(),
    compare: jest.fn(),
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

const existingUser = {
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    username:`manager1@example.com`,
    password: `testpassword1234`,
    is_manager: true
}

const existingEmployee = {
    user_id: `3b583994-c9cd-45ea-8c9f-d78921a2e501`,
    username:`employee1@example.com`,
    password: `testpassword1234`,
    is_manager: false
}

const updatedEmployee = {
    user_id: `3b583994-c9cd-45ea-8c9f-d78921a2e501`,
    username:`employee1@example.com`,
    password: `testpassword1234`,
    is_manager: false
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

describe(`Change User role`, () => {
    beforeEach(() => {
        userDAO.getUser.mockImplementation(() => Promise.resolve())
        userDAO.getUser.mockResolvedValue(existingEmployee)
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test(`Update user role`, async () => {
        const user = await userService.getUser(existingEmployee.user_id)
        expect(user).toBeTruthy()
        expect(user).toEqual(existingEmployee)

        userDAO.updateUser.mockImplementation(() => Promise.resolve())
        userDAO.updateUser.mockResolvedValue(updatedEmployee)

        const updatedUser = await userService.updateUser(existingUser.user_id, existingUser.is_manager)
        expect(updatedUser).toEqual(updatedEmployee)

    })
})
