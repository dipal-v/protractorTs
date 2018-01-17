@address
Feature: Address Dialog
    As a user of Leto
    I want to create a address details for Entity via browser
    So that I can view address Details

    @validation
    Scenario: Address validations
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176212"
        Then I see "Test Explore USA" in the title
        When I click New Address button
        Then I should see "New Address" dialog
        When I click the address dialog button
        Then I see the 2 validation errors displayed

    @validation
    Scenario: Address country change validation
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176212"
        Then I see "Test Explore USA" in the title
        When I click New Address button
        Then I should see "New Address" dialog
        Then I should see the state as "Armagh"
        When I change the country to Afghanistan
        Then I should see the state as "Badakhshan"

    Scenario: Create an address in organisation page
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176212"
        Then I see "Test Explore USA" in the title
        When I click New Address button
        Then I should see "New Address" dialog
        When I fill the address details with city as "London"
        Then I see city "London" on the entity page

    Scenario: Update an address in organisation page
        Given I am on organisations home page
        Given I have an existing entity with legal entity code "176214"
        Then I see "Gas Exploration witout contact" in the title
        When I click edit button in the grid for address
        Then I should see "Update Address" dialog
        When I fill the address details with city as "Oxford"
        Then I see city "Oxford" on the entity page

    Scenario: Create an address in person page
        Given I am on organisations home page
        Given I have an existing person entity with legal entity code "176223"
        Then I see "Mr. John Doe" in the title
        When I click New Address button
        Then I should see "New Address" dialog
        When I fill the address details with city as "London"
        Then I see city "London" on the entity page

    Scenario: Update an address in person page
        Given I am on organisations home page
        Given I have an existing person entity with legal entity code "176216"
        Then I see "Mrs. Alex White" in the title
        When I click edit button in the grid for address
        Then I should see "Update Address" dialog
        When I fill the address details with city as "Oxford"
        Then I see city "Oxford" on the entity page