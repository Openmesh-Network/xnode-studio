# Xnode Studio

## Installation and dev environment
</br>

Using npm to install the dependecies (at the moment there is depeencies conflicts that will need to be resolved, so use --force)
```shell
npm install --force
```
</br>
</br>
When in dev mode, make sure to comment the  ```shell  assetPrefix: process.env.NEXT_PUBLIC_API_ASSET_PREFIX, ``` at ```next.config.js```.
As Xnode studio use Vercel Routing to intantiate its paths, the production environment need to have this assetPrefix set to work succesfully, but during the development (localhost) it`s not needed. https://github.com/Openmesh-Network/urlPathL3A

<img src="https://github.com/Openmesh-Network/xnode-console-frontend/assets/82957886/22ed0294-65a7-4b2f-92f9-60461e4cf790" alt="drawing" style="width:500px;"/>

</br>
</br>
</br>

Envs:
```shell
NEXT_PUBLIC_WALLET_ENVIRONMENT="Polygon Mumbai"
NEXT_PUBLIC_API_ASSET_PREFIX="https://deeplink-frontend-dao.vercel.app"
NEXT_PUBLIC_API_BACKEND_BASE_URL="https://dpl-backend-homolog.up.railway.app"
NEXT_PUBLIC_API_BACKEND_KEY="as90qw90uj3j9201fj90fj90dwinmfwei98f98ew0-o0c1m221dds222143"
NEXT_PUBLIC_API_BACKEND_BASE_URL="https://dpl-backend-homolog.up.railway.app"
NEXT_PUBLIC_JSON_RPC="https://polygon-mumbai.g.alchemy.com/v2/6XFcpiY-OYMhStUfVvVuYdPUMyeQOZbW"
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="73e5158564b1f982b971cf49bd1a1bea"
```
</br>
</br>

Start the script
```shell
npm run dev
```
