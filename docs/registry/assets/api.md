<!-- Generator: Widdershins v4.0.1 -->

<h1 id="profile-registry-api">Profile Registry API v0.0.0</h1>

> Scroll down for code samples, example requests and responses. Select a language for code samples from the tabs above or the mobile navigation menu.

Profile Registry API Documentation.

# Authentication

- HTTP Authentication, scheme: basic 

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

## post__admin_account_{id}_

> Code samples

```shell
# You can also use wget
curl -X POST /admin/account/{id}/ \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`POST /admin/account/{id}/`

会員の作成・表示・更新・削除

> Body parameter

```json
{
  "input": {}
}
```

<h3 id="post__admin_account_{id}_-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|false|none|
|» input|body|object|false|Prisma.accountsCreateInput または Prisma.accountsUpdateInput を与えます。|

#### Detailed descriptions

**» input**: Prisma.accountsCreateInput または Prisma.accountsUpdateInput を与えます。
詳細は[データベーススキーマ](https://github.com/webdino/profile/blob/main/packages/registry-db/prisma/schema.prisma)を参照してください。

> Example responses

> 200 Response

```json
{}
```

<h3 id="post__admin_account_{id}_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|

<h3 id="post__admin_account_{id}_-responseschema">Response Schema</h3>

Status Code **200**

*会員*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicAuth
</aside>

## get__admin_account_{id}_

> Code samples

```shell
# You can also use wget
curl -X GET /admin/account/{id}/ \
  -H 'Accept: application/json'

```

`GET /admin/account/{id}/`

会員の作成・表示・更新・削除

<h3 id="get__admin_account_{id}_-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{}
```

<h3 id="get__admin_account_{id}_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|

<h3 id="get__admin_account_{id}_-responseschema">Response Schema</h3>

Status Code **200**

*会員*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicAuth
</aside>

## put__admin_account_{id}_

> Code samples

```shell
# You can also use wget
curl -X PUT /admin/account/{id}/ \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`PUT /admin/account/{id}/`

会員の作成・表示・更新・削除

> Body parameter

```json
{
  "input": {}
}
```

<h3 id="put__admin_account_{id}_-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|false|none|
|» input|body|object|false|Prisma.accountsCreateInput または Prisma.accountsUpdateInput を与えます。|

#### Detailed descriptions

**» input**: Prisma.accountsCreateInput または Prisma.accountsUpdateInput を与えます。
詳細は[データベーススキーマ](https://github.com/webdino/profile/blob/main/packages/registry-db/prisma/schema.prisma)を参照してください。

> Example responses

> 200 Response

```json
{}
```

<h3 id="put__admin_account_{id}_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|

<h3 id="put__admin_account_{id}_-responseschema">Response Schema</h3>

Status Code **200**

*会員*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicAuth
</aside>

## delete__admin_account_{id}_

> Code samples

```shell
# You can also use wget
curl -X DELETE /admin/account/{id}/ \
  -H 'Accept: application/json'

```

`DELETE /admin/account/{id}/`

会員の作成・表示・更新・削除

<h3 id="delete__admin_account_{id}_-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{}
```

<h3 id="delete__admin_account_{id}_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|

<h3 id="delete__admin_account_{id}_-responseschema">Response Schema</h3>

Status Code **200**

*会員*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicAuth
</aside>

## post__admin_publisher_{id}_

> Code samples

```shell
# You can also use wget
curl -X POST /admin/publisher/{id}/ \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`POST /admin/publisher/{id}/`

ウェブページの作成・表示・更新・削除

> Body parameter

```json
{
  "input": {}
}
```

<h3 id="post__admin_publisher_{id}_-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|false|none|
|» input|body|object|false|Prisma.websitesCreateInput または Prisma.websitesUpdateInput を与えます。|

#### Detailed descriptions

**» input**: Prisma.websitesCreateInput または Prisma.websitesUpdateInput を与えます。
詳細は[データベーススキーマ](https://github.com/webdino/profile/blob/main/packages/registry-db/prisma/schema.prisma)を参照してください。

> Example responses

> 200 Response

```json
{}
```

<h3 id="post__admin_publisher_{id}_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|

<h3 id="post__admin_publisher_{id}_-responseschema">Response Schema</h3>

Status Code **200**

*ウェブページ*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicAuth
</aside>

## get__admin_publisher_{id}_

> Code samples

```shell
# You can also use wget
curl -X GET /admin/publisher/{id}/ \
  -H 'Accept: application/json'

```

`GET /admin/publisher/{id}/`

ウェブページの作成・表示・更新・削除

<h3 id="get__admin_publisher_{id}_-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{}
```

<h3 id="get__admin_publisher_{id}_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|

<h3 id="get__admin_publisher_{id}_-responseschema">Response Schema</h3>

Status Code **200**

*ウェブページ*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicAuth
</aside>

## put__admin_publisher_{id}_

> Code samples

```shell
# You can also use wget
curl -X PUT /admin/publisher/{id}/ \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`PUT /admin/publisher/{id}/`

ウェブページの作成・表示・更新・削除

> Body parameter

```json
{
  "input": {}
}
```

<h3 id="put__admin_publisher_{id}_-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|false|none|
|» input|body|object|false|Prisma.websitesCreateInput または Prisma.websitesUpdateInput を与えます。|

#### Detailed descriptions

**» input**: Prisma.websitesCreateInput または Prisma.websitesUpdateInput を与えます。
詳細は[データベーススキーマ](https://github.com/webdino/profile/blob/main/packages/registry-db/prisma/schema.prisma)を参照してください。

> Example responses

> 200 Response

```json
{}
```

<h3 id="put__admin_publisher_{id}_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|

<h3 id="put__admin_publisher_{id}_-responseschema">Response Schema</h3>

Status Code **200**

*ウェブページ*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicAuth
</aside>

## delete__admin_publisher_{id}_

> Code samples

```shell
# You can also use wget
curl -X DELETE /admin/publisher/{id}/ \
  -H 'Accept: application/json'

```

`DELETE /admin/publisher/{id}/`

ウェブページの作成・表示・更新・削除

<h3 id="delete__admin_publisher_{id}_-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|

> Example responses

> 200 Response

```json
{}
```

<h3 id="delete__admin_publisher_{id}_-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|Default Response|Inline|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|

<h3 id="delete__admin_publisher_{id}_-responseschema">Response Schema</h3>

Status Code **200**

*ウェブページ*

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicAuth
</aside>

## post__admin_publisher_{id}_issue

> Code samples

```shell
# You can also use wget
curl -X POST /admin/publisher/{id}/issue \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`POST /admin/publisher/{id}/issue`

DP の登録

> Body parameter

```json
{
  "jwt": "string"
}
```

<h3 id="post__admin_publisher_{id}_issue-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|id|path|string|true|none|
|body|body|object|true|none|
|» jwt|body|string|true|DP (JWT)|

> Example responses

> 200 Response

```json
"string"
```

<h3 id="post__admin_publisher_{id}_issue-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|ok|string|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|

<h3 id="post__admin_publisher_{id}_issue-responseschema">Response Schema</h3>

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicAuth
</aside>

## post__admin_certifier_{certifier_id}_holder_{holder_id}_issue

> Code samples

```shell
# You can also use wget
curl -X POST /admin/certifier/{certifier_id}/holder/{holder_id}/issue \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json'

```

`POST /admin/certifier/{certifier_id}/holder/{holder_id}/issue`

OP の登録

> Body parameter

```json
{
  "jwt": "string"
}
```

<h3 id="post__admin_certifier_{certifier_id}_holder_{holder_id}_issue-parameters">Parameters</h3>

|Name|In|Type|Required|Description|
|---|---|---|---|---|
|certifier_id|path|string|true|none|
|holder_id|path|string|true|none|
|body|body|object|true|none|
|» jwt|body|string|true|OP (JWT)|

> Example responses

> 200 Response

```json
"string"
```

<h3 id="post__admin_certifier_{certifier_id}_holder_{holder_id}_issue-responses">Responses</h3>

|Status|Meaning|Description|Schema|
|---|---|---|---|
|200|[OK](https://tools.ietf.org/html/rfc7231#section-6.3.1)|ok|string|
|400|[Bad Request](https://tools.ietf.org/html/rfc7231#section-6.5.1)|Default Response|Inline|

<h3 id="post__admin_certifier_{certifier_id}_holder_{holder_id}_issue-responseschema">Response Schema</h3>

Status Code **400**

|Name|Type|Required|Restrictions|Description|
|---|---|---|---|---|
|» statusCode|number|false|none|none|
|» error|string|false|none|none|
|» message|string|false|none|none|

<aside class="warning">
To perform this operation, you must be authenticated by means of one of the following methods:
basicAuth
</aside>

# Schemas

