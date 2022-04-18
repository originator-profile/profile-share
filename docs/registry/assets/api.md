<!-- Generator: Widdershins v4.0.1 -->

<h1 id="profile-registry-api">Profile Registry API v0.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Profile Registry API Documentation.

<h1 id="profile-registry-api-default">Default</h1>

## frontend

<a id="opIdfrontend"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /{wildcard}

```

`GET {wildcard}`

<h3 id="frontend-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|None|

<aside class="success">
This operation does not require authentication
</aside>

## getContext

<a id="opIdgetContext"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /context \
  -H 'Accept: application/ld+json'

```

`GET /context`

> Example responses

> 200 Response

```json
{
  "@context": {
    "op": "https://github.com/webdino/profile#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "main": {
      "@id": "op:main",
      "@type": "xsd:string"
    },
    "profile": {
      "@id": "op:profile",
      "@type": "xsd:string"
    },
    "publisher": {
      "@id": "op:publisher",
      "@type": "xsd:string"
    },
    "advertiser": {
      "@id": "op:advertiser",
      "@type": "xsd:string"
    }
  }
}
```

<h3 id="getcontext-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|

<h3 id="getcontext-responseschema">Response Schema</h3>

Status Code **200**

*JSON-LD context*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

<aside class="success">
This operation does not require authentication
</aside>

## getIssuerKeys

<a id="opIdgetIssuerKeys"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /.well-known/jwks.json \
  -H 'Accept: application/json'

```

`GET /.well-known/jwks.json`

> Example responses

> 200 Response

```json
{
  "keys": [
    {
      "kty": "string",
      "use": "string",
      "key_ops": [
        "string"
      ],
      "alg": "string",
      "kid": "string",
      "x5u": "string",
      "x5c": [
        "string"
      ],
      "x5t": "string",
      "x5t#S256": "string"
    }
  ]
}
```

<h3 id="getissuerkeys-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Default Response|Inline|

<h3 id="getissuerkeys-responseschema">Response Schema</h3>

Status Code **200**

*JSON Web Key Sets*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» keys|[object]|true|none|none|
|»» JSON Web Key|object|false|none|none|
|»»» kty|string|true|none|none|
|»»» use|string|false|none|none|
|»»» key_ops|[string]|false|none|none|
|»»» alg|string|false|none|none|
|»»» kid|string|false|none|none|
|»»» x5u|string|false|none|none|
|»»» x5c|[string]|false|none|none|
|»»» x5t|string|false|none|none|
|»»» x5t#S256|string|false|none|none|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## getIssuerProfiles

<a id="opIdgetIssuerProfiles"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /.well-known/op-document \
  -H 'Accept: application/json'

```

`GET /.well-known/op-document`

> Example responses

> 200 Response

```json
{}
```

<h3 id="getissuerprofiles-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Default Response|Inline|

<h3 id="getissuerprofiles-responseschema">Response Schema</h3>

Status Code **200**

*Originator Profile Document*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## getKeys

<a id="opIdgetKeys"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /account/{id}/keys \
  -H 'Accept: application/json'

```

`GET /account/{id}/keys`

<h3 id="getkeys-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{
  "keys": [
    {
      "kty": "string",
      "use": "string",
      "key_ops": [
        "string"
      ],
      "alg": "string",
      "kid": "string",
      "x5u": "string",
      "x5c": [
        "string"
      ],
      "x5t": "string",
      "x5t#S256": "string"
    }
  ]
}
```

<h3 id="getkeys-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Default Response|Inline|

<h3 id="getkeys-responseschema">Response Schema</h3>

Status Code **200**

*JSON Web Key Sets*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» keys|[object]|true|none|none|
|»» JSON Web Key|object|false|none|none|
|»»» kty|string|true|none|none|
|»»» use|string|false|none|none|
|»»» key_ops|[string]|false|none|none|
|»»» alg|string|false|none|none|
|»»» kid|string|false|none|none|
|»»» x5u|string|false|none|none|
|»»» x5c|[string]|false|none|none|
|»»» x5t|string|false|none|none|
|»»» x5t#S256|string|false|none|none|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

## getProfiles

<a id="opIdgetProfiles"></a>

> Code samples

```shell
# You can also use wget
curl -X GET /account/{id}/profiles \
  -H 'Accept: application/ld+json'

```

`GET /account/{id}/profiles`

<h3 id="getprofiles-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{}
```

<h3 id="getprofiles-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|
|404|[Not Found](https://tools.ietf.org/html/rfc7231#section-6.5.4)|Default Response|Inline|

<h3 id="getprofiles-responseschema">Response Schema</h3>

Status Code **200**

*Originator Profile Document*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

Status Code **404**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="success">
This operation does not require authentication
</aside>

# Schemas

