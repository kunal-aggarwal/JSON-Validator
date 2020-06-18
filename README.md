# JSON-Validator
This is a tool to validate JSON schema against master JSON payload. For xml documents, there are various schemas and 
validation tools available to check the conformity of payload. But for JSON I found NONE.
This tool takes 2 JSON files as input master.json and payload.json and compares those again each other.
It returns the structural differences between the documents fro the stand point of keys and data types.
It iterates over each object/node in the master JSON and verifies whether payload JSON has all those keys available
with the expected type and at the expected position.

Command to run:
C:>node compare.js
-----------------------------------------------
Following is the sample output-
Payload is non-conformant. Found the following discrepancies....
 1: fName must be a string
 2: lName is missing
 3: address.city is missing
 4: friends[0].name.lName is missing
 5: friends[0].name.schoolFriend is missing
 6: friends[0].name.collegeFriend? must be a boolean
 7: friends[1].name.fName is missing
 8: friends[1].name.schoolFriend is missing
 9: friends[1].name.collegeFriend? is missing
 10: friends[2].name.fName is missing
 11: friends[2].name.address must be an object
 12: friends[2].name.schoolFriend is missing
 13: friends[2].name.collegeFriend? is missing
 14: friends[3].name is missing
 15: citiesVisited must be an array
 16: address2 must be an object
 17: Id must be a number
 18: friends[0].name.schoolFriend? is redundant
 19: friends[0].name1 is redundant
 20: born is redundant
 21: zip is redundant
 done..
------------------------------------------------------ 
 
