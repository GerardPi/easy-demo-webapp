
 Get persons addresses

   Given person "1" is stored in the database with first name "Frits" and last name "Jansma" and date of birth "2001-11-23" in the database
     And person "2" is stored in the database with first name "Albert" and last name "Fles" and date of birth "2002-11-24" in the database
     And an address "1" is stored in the database with values "class=io.github.gerardpi.easy.demo.web.addressbook.AddressDto;id=null;etag=null;countryCode=NL;city=Amsterdam;postalCode=1010AA;street=Alkmaarstraat;houseNumber=1a"
     And an address "1" is stored in the database with values "class=io.github.gerardpi.easy.demo.web.addressbook.AddressDto;id=null;etag=null;countryCode=NL;city=Amsterdam;postalCode=1010AA;street=Alblasserdamstraat;houseNumber=1b"
    When an HTTP "GET" on "/api/persons" is performed
    Then the HTTP status code is "200 OK"
     And the number of items received is 2
    When an HTTP "GET" on "/api/addresses" is performed
    Then the HTTP status code is "200 OK"
     And the number of items received is 2
    When an HTTP "GET" on "/api/persons/" with the id for entity "1" is performed
    When an HTTP "POST" on "/api/person-addresses" is performed with body 
          ----------------------------------------------------------------------
          {
                    "fromDate": "1994-01-01",
                    "description": "this is where the person lived",
                    "personId": "00000000-1111-2222-3333-444444444444",
                    "type": "RESIDENCE",
                    "addressId": "00000003-1111-2222-3333-444444444444",
                    "thruDate": "2013-08-12"
          }
          ----------------------------------------------------------------------

    Then the HTTP status code is "201 CREATED"
     And the location in the response is "/api/person-addresses/00000004-1111-2222-3333-444444444444"
     And the etag in the response is "0"

