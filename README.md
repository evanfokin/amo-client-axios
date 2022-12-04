# Установка

Через npm:

```
npm install amo-client-axios
```

Через yarn:

```
yarn add amo-client-axios
```

# Использование

Для создания axios-инстанса достаточно одного идентификатора интеграции:

```typescript
import { create } from 'amo-client-axios'

const clientId = '22e86546-ba5c-4599-8e02-49e711e0cd4f'
const axios = create(clientId)

axios.get('https://your-api-service.io/api/resource')
```

Использование с базовым конфигом для axios:

```typescript
const axios = create(clientId, {
  baseURL: 'https://your-api-service.io/api',
  params: {
    some: 1
  }
})

axios.get('/resource')
```
