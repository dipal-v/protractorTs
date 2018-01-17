@person
Feature: Persons
As a user of Leto
I want to create new person
So that I can manage legal entities

    @validation
    Scenario: Create person record validation
        Given I am on persons home page
        When I click create person page
        When I click the create button
        Then I see the 6 validation errors displayed

    @validation
    Scenario Outline: Medium type validations
        Given I am on organisations home page
        Given I am on create person page
        When I select "<mediumType>" and enter invalid "<input>" and click add medium button
        Then I should view invalid "<mediumType>" validation message
        When I click cancel buton in the dialog
        Examples:
        | mediumType  | input |
        | phone       | test  |
        | email       | test  |
        | web address | test  |

    @search @list
    Scenario Outline: List View Search Entity
        Given I am on persons home page
        Then I see "Alex" from the back end in persons page
        When I search for "<query>" with "<filter>" filter
        Then I verify <resultsCount> results in search results
        Examples:
        | query | filter      | resultsCount |
        | 17621 | entity code | 2            |
        | a     | given name  | 2            |
        | o     | surname     | 2            |

    @search @list @regex
    Scenario Outline: List View Search Entity with regular expersion
        Given I am on persons home page
        Then I see "Alex" from the back end in persons page
        When I search for regex "<query>" with "<filter>" filter
        Then I verify <resultsCount> results in search results
        Examples:
        | query | filter      | resultsCount |
        | .*16  | entity code | 1            |
        | .*ck  | given name  | 1            |

    Scenario: Create person entity
        Given I am on persons home page
        When I click create person page
        When I create a person details with full name "Bill Gates"
        Then I see "Mr. Bill Gates" in the title

    Scenario: Cancel Create person entity
        Given I am on persons home page
        When I click create person page
        When I click the cancel button
        Then I see "Alex" from the back end in persons page

    Scenario: Deactivate person record cancel action
        Given I am on persons home page
        Given I have an existing person entity with legal entity code "176223"
        When I click the deactivate button
        When I click the no button in confirm dialog
        Then I should not see an end date

    Scenario: Deactivate person record
        Given I am on persons home page
        Given I have an existing person entity with legal entity code "176223"
        When I click the deactivate button
        When I click the yes button in confirm dialog
        Then I should see an end date

    Scenario: Activate person record cancel action
        Given I am on persons home page
        Given I have an existing person entity with legal entity code "176223"
        When I click the activate button
        When I click the no button in confirm dialog
        Then I should see an end date

    Scenario: Activate person record
        Given I am on persons home page
        Given I have an existing person entity with legal entity code "176223"
        When I click the activate button
        When I click the yes button in confirm dialog
        Then I should not see an end date

    Scenario: Update person entity
        Given I am on organisations home page
        Given I am on persons home page
        Given I have an existing person entity with legal entity code "176223"
        When I click modify button
        When I modify its job title as "Tome Raider"
        Then I should see the job title in its view page

    Scenario: Cancel Update person entity
        Given I am on organisations home page
        Given I am on persons home page
        Given I have an existing person entity with legal entity code "176223"
        When I click modify button
        When I click the cancel button
        Then I see "Alex" from the back end in persons page