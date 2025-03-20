jest.mock(`../repository/userDAO.js`, () => {
    return {
        getUserByUsername: jest.fn(),
        // Add other DAO functions as needed
      }
})

jest.mock(`../repository/ticketDAO.js`, () => {
    return {
        createTicket: jest.fn(),
        getTicket: jest.fn(),
        // getTickets: jest.fn(),
        getTicketsByUserID: jest.fn(),
        getTicketsByStatus: jest.fn(),
        updateTicketStatusByTicketID: jest.fn(),
        // Add other DAO functions as needed
      }
})

const ticketService = require(`../service/ticketService.js`)
const ticketDAO  = require(`../repository/ticketDAO.js`)
const userDAO  = require(`../repository/userDAO.js`)

const employee = {
    username:`employee1@example.com`,
    password: `testpassword1234`
}

const unknownUser = {
    username:`employee100@example.com`,
    password: `testpassword1234`
}

const existingManager = {
    user_id: `affb5537-acc0-487e-8f61-6605f92f7387`,
    username:`manager1@example.com`,
    password: `testpassword1234`,
    is_manager: true
}

const existingEmployee = {
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    username:`employee1@example.com`,
    password: `testpassword1234`,
    is_manager: false
}

const truthyTicket = {
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    amount: 30,
    description: `food`
}

const falsyTicket = {
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    description: `food`
}

const existingTicket = [{
    ticket_id: `3310a3cb-0139-4313-b39e-39216cda7aa6`,
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    amount: 30,
    description: `food`,
    creation_timestamp: 1741990740697,
    ticket_status: `pending`,
    type: `food`
}]

const existingTickets = [{
    ticket_id: `3310a3cb-0139-4313-b39e-39216cda7aa6`,
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    amount: 30,
    description: `food`,
    creation_timestamp: 1741990740697,
    ticket_status: `pending`,
    type: `food`
},
{
    ticket_id: `3310a3cb-0139-4313-b39e-39216cda7aa6`,
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    amount: 30,
    description: `parking`,
    creation_timestamp: 1741990740697,
    ticket_status: `approved`,
    update_timestamp: 1741991195008,
    type: `parking`
}]

const approvedTicket = {
    ticket_id: `3310a3cb-0139-4313-b39e-39216cda7aa6`,
    user_id: `a165ddee-ff40-409b-bc85-adf54968075d`,
    amount: 30,
    description: `food`,
    creation_timestamp: 1741990740697,
    ticket_status: `approved`,
    update_timestamp: 1741991195008
}

const managerTicket = {
    ticket_id: `3310a3cb-0139-4313-b39e-39216cda7aa6`,
    user_id: `affb5537-acc0-487e-8f61-6605f92f7387`,
    amount: 30,
    description: `food`,
    creation_timestamp: 1741990740697,
    ticket_status: `pending`
}

describe(`Unknown User`, () => {
    test(`Unknown User - not registered username`, async () => {
        expect(await ticketService.validateUserID(unknownUser.username)).toBeFalsy()
    })
})

describe(`Employee Ticket Handling`, () => {
    beforeEach(() => {
        userDAO.getUserByUsername.mockImplementation(() => Promise.resolve())
        userDAO.getUserByUsername.mockResolvedValue([existingEmployee])
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
    
    test(`Employee found`, async () => {
        expect(await ticketService.validateUserID(employee.username)).toEqual(existingEmployee)
    })

    test(`Ticket has no amount or description`, async () => {
        expect(await ticketService.validateTicketData(falsyTicket)).toBeFalsy()
    })

    test(`Succesful Ticket creation`, async () => {
        const ticket = await ticketService.validateTicketData(truthyTicket)
        expect(ticket).toBeTruthy()
        expect(ticket).toEqual(truthyTicket)

        ticketDAO.createTicket.mockImplementation(() => Promise.resolve())
        ticketDAO.createTicket.mockResolvedValue(existingTicket)

        expect(await ticketService.createTicket(ticket)).toEqual(existingTicket)
    })

    test(`Retrieve previous tickets`, async () => {
        ticketDAO.getTicketsByUserID.mockImplementation(() => Promise.resolve())
        ticketDAO.getTicketsByUserID.mockResolvedValue(existingTickets)

        expect(await ticketService.getTicketsByUserID(truthyTicket.user_id, null)).toEqual(existingTickets)
    })

    test(`Retrieve previous tickets by type`, async () => {
        ticketDAO.getTicketsByUserID.mockImplementation(() => Promise.resolve())
        ticketDAO.getTicketsByUserID.mockResolvedValue(existingTicket)

        expect(await ticketService.getTicketsByUserID(truthyTicket.user_id, `food`)).toEqual(existingTicket)
    })
})

describe(`Manager Ticket Handling`, () => {
    beforeEach(() => {
        userDAO.getUserByUsername.mockImplementation(() => Promise.resolve())
        userDAO.getUserByUsername.mockResolvedValue([existingManager])
    })

    afterEach(() => {
        jest.clearAllMocks()
    })
    
    test(`Retrieve previous pending tickets`, async () => {
        ticketDAO.getTicketsByStatus.mockImplementation(() => Promise.resolve())
        ticketDAO.getTicketsByStatus.mockResolvedValue(existingTicket)

        expect(await ticketService.getTicketsByStatus()).toEqual(existingTicket)
    })

    test(`Change ticket status of employee`, async () => {
        ticketDAO.updateTicketStatusByTicketID.mockImplementation(() => Promise.resolve())
        ticketDAO.updateTicketStatusByTicketID.mockResolvedValue(approvedTicket)

        expect(await ticketService.updateTicketStatusByTicketID(existingTicket[0].ticket_id, `approved`)).toEqual(approvedTicket)
    })

    test(`Can't change own ticket status`, async () => {
        ticketDAO.getTicket.mockImplementation(() => Promise.resolve())
        ticketDAO.getTicket.mockResolvedValue(managerTicket)

        expect(await ticketService.getTicket(managerTicket.ticket_id)).toEqual(managerTicket)
    })
})

describe(`Branching coverage`, () => {
    beforeEach(() => {
        ticketDAO.createTicket.mockImplementation(() => Promise.resolve())
        ticketDAO.createTicket.mockResolvedValue()
        ticketDAO.getTicketsByStatus.mockImplementation(() => Promise.resolve())
        ticketDAO.getTicketsByStatus.mockResolvedValue()
        ticketDAO.getTicket.mockImplementation(() => Promise.resolve())
        ticketDAO.getTicket.mockResolvedValue()
        ticketDAO.getTicketsByUserID.mockImplementation(() => Promise.resolve())
        ticketDAO.getTicketsByUserID.mockResolvedValue()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test(`createTicket DAO failed`, async () => {
        const ticket = await ticketService.createTicket(truthyTicket)
        expect(ticket).toBeNull()
    })

    test(`getTicketsByStatus DAO failed`, async () => {
        const ticket = await ticketService.getTicketsByStatus(truthyTicket)
        expect(ticket).toBeNull()
    })

    test(`getTicket DAO failed`, async () => {
        let ticket = await ticketService.getTicket()
        expect(ticket).toBeNull()

        ticket = await ticketService.getTicket(truthyTicket)
        expect(ticket).toBeNull()
    })

    test(`getTicketsByUserID DAO failed`, async () => {
        let ticket = await ticketService.getTicketsByUserID()
        expect(ticket).toBeNull()

        ticket = await ticketService.getTicketsByUserID(truthyTicket)
        expect(ticket).toBeNull()
    })

    test(`updateTicketStatusByTicketID DAO failed`, async () => {
        let ticket = await ticketService.updateTicketStatusByTicketID(truthyTicket)
        expect(ticket).toBeNull()

        ticketDAO.updateTicketStatusByTicketID.mockResolvedValue()
        
        ticket = await ticketService.updateTicketStatusByTicketID(truthyTicket, `approved`)
        expect(ticket).toBeNull()
    })
})
