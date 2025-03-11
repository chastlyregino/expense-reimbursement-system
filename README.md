# Ticketing Reimbursement System

## Required Features

### Login / Register Feature

The login and register feature is meant to give you preliminary experience handling authentication within an application. These features allow you to ensure you can track or maintain who can connect to your application.
User Stories
As an Employee or Manager, I should be able to log into the application.

Ability to register a new account

- Must ensure the username is not already registered
- Default employee role
- Should register with at least a username and password


### Submit Ticket Feature

The submit ticket feature is meant to guide you through input acceptance, validation, and error handling. The ability to submit a reimbursement request ticket is the core functionality of this application.
User Stories
Employees can submit a new reimbursement ticket

- Must have an amount
- Must have a description
- Should have a default status of Pending


### Ticketing System Feature

The ticketing system feature is meant to act as the primary interface for internal managers. Managers will use this interface to process the pending reimbursement request tickets and either approve or deny these requests.
User Story
Managers can process tickets submitted by employees

- Tickets can be Approved or Denied
- Tickets cannot change status after processing
- Pending tickets should be added to a queue or list that managers can see
- Tickets should be removed from the list, or queue, once processed (approved/denied) by a manager


### View Previous Tickets Feature

The view previous tickets feature is meant for employees to see their request submission history. Employees will leverage this to see outstanding pending tickets along with tickets that have been processed by managers.
User Story

- As an Employee, I should be able to view all previous reimbursement ticket submissions.
- Previous tickets should also show the details of submission.


## Extension Features

### Frontend

User Story
As an Employee or Manager, I can access the application using a frontend website.

- Using HTML, CSS, and JavaScript, create a frontend to interact with your API.

### Reimbursement Types Feature

User Story
Employees can add Reimbursement Types

- Travel, Lodging, Food, Other
- Employees can view previous requests filtered by type


### Change Roles Feature

User Story
Managers can change other users’ roles

- Employee to Manager or back to Employee


### Upload Receipts Feature

User Story
Employees can add images of receipts to their reimbursement requests

- Upload and store images (in SQL or cloud storage)


### User Accounts Feature

User Story
User Profile/Account

- Track additional user information (name, address, etc.)
- Users can edit their account
- Users can add a profile picture