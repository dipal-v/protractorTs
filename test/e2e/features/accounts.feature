@account
Feature: Account Dialog
    As a user of Leto
    I want to create an account for a legal entity
    So I can view the account details

    @validation
    Scenario: Account validations
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176212"
        Then I see "Test Explore USA" in the title
        When I click New Account button
        Then I should see "New Account" dialog
        When I click the account dialog button
        Then I see the 3 validation errors displayed

    Scenario: Create an account in organisation page
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176213"
        Then I see "Oil Exploration Without Contact and Address" in the title
        When I click New Account button
        Then I should see "New Account" dialog
        When I fill the account details with name "Beijing Maritime"
        Then I see account name "Beijing Maritime" on the entity page

    Scenario: Update an account in organisation page
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176212"
        Then I see "Test Explore USA" in the title
        When I click edit button in the grid for account
        Then I should see "Update Account" dialog
        When I fill the account details with name "Beijing Maritime"
        Then I see account name "Beijing Maritime" on the entity page

    Scenario: Create an account in person page
        Given I am on organisations home page
        Given I have an existing person entity with legal entity code "176223"
        Then I see "Mr. John Doe" in the title
        When I click New Account button
        Then I should see "New Account" dialog
        When I fill the account details with name "Beijing Maritime"
        Then I see account name "Beijing Maritime" on the entity page
