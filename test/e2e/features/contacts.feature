@contact
Feature: Contact Dialog
    As a user of Leto
    I want to create a contact details for Entity via browser
    So that I can view conatct Details

    @validation
    Scenario: Contact validations
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176212"
        Then I see "Test Explore USA" in the title
        When I click New Contact button
        Then I should see "New Contact" dialog
        When I click the contact dialog button
        Then I see the 3 validation errors displayed

    @validation
    Scenario Outline: Contact validations for mediums
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176212"
        Then I see "Test Explore USA" in the title
        When I click New Contact button
        Then I should see "New Contact" dialog
        When I select "<mediumType>" and click add medium button
        When I enter invalid "<input>" and click add button 
        Then I should view invalid "<mediumType>" validation message
        Examples:
        | mediumType  | input |
        | phone       | test  |
        | email       | test  |
        | web address | test  |

    Scenario: Create a contact in organisation page
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176212"
        Then I see "Test Explore USA" in the title
        When I click New Contact button
        Then I should see "New Contact" dialog
        When I fill the contact details with surname "Trump" and given name "Junior"
        Then I see surname "Trump" on the entity page

    Scenario: Update an contact in organisation page
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176215"
        Then I see "Cheddar Exploration without address" in the title
        When I click edit button in the grid for contact
        Then I should see "Update Contact" dialog
        When I fill the contact details with surname "Test" and given name "User"
        Then I see surname "Test" on the entity page

    Scenario: Create an contact in person page
        Given I am on organisations home page
        Given I have an existing person entity with legal entity code "176223"
        Then I see "Mr. John Doe" in the title
        When I click New Contact button
        Then I should see "New Contact" dialog
        When I fill the contact details with surname "Trump" and given name "Junior"
        Then I see surname "Trump" on the entity page

    Scenario: Update an contact in person page
        Given I am on organisations home page
        Given I have an existing person entity with legal entity code "176217"
        Then I see "Mrs. Jack Brown" in the title
        When I click edit button in the grid for contact
        Then I should see "Update Contact" dialog
        When I fill the contact details with surname "Test" and given name "User"
        Then I see surname "Test" on the entity page