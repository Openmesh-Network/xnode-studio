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

Start the script
```shell
npm run dev
```
