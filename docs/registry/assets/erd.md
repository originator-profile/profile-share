```mermaid
erDiagram

        Role {
            GROUP GROUP
CERTIFIER CERTIFIER
        }
    
  Op {
      Int id
    DateTime issuedAt
    DateTime expiredAt
    String jwt
    }
  

  Account {
      Int id
    String url
    Role role
    String name
    String description
    String email
    String phoneNumber
    String postalCode
    String addressCountry
    String addressRegion
    String addressLocality
    String addressStreet
    String logo
    }
  

  BusinessCategory {
      Int id
    String value
    }
  

  Publication {
      DateTime publishedAt
    }
  

  Key {
      Int id
    Json jwk
    }
  
    Op o{--|| Account : "certifier"
    Account o|--|| Role : "enum:role"
    Account o{--}o BusinessCategory : ""
    BusinessCategory o{--}o Account : ""
    Publication o|--|| Op : "op"
    Publication o{--|| Account : "account"
    Key o{--|| Account : "account"
```
