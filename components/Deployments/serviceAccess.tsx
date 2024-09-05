import { ServiceData, ServiceOption, ServiceFromName, XnodeConfig } from "@/types/dataProvider";
import Header from '@/components/ui/header'
import { useState } from "react";
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogClose,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog'

export function formatSSHKeys(keys: string): string {
    if (keys.includes('[]')){
        keys.replace('[]', '')
    }
    return keys.split('\n').map(key => "\"" + key.trim() + "\"").join(` `);
}

export function sshUserData(inputSshKey) {
    const formattedSSHKeys = formatSSHKeys(inputSshKey)
    const userData: ServiceData ={
        name: "xnode",
        tags: [],
        specs: {ram:0,storage:0},
        desc: "Xnode access via SSH",
        nixName: "\"xnode\"",
        options: [{
            name: "openssh.authorizedKeys.keys",
            nixName: "openssh.authorizedKeys.keys",
            desc: "ssh key",
            type: "list of string",
            value: `[${formattedSSHKeys}]`
    
        }]
    };
    return userData
}

// 
const ServiceAccess = ({ currentService, ip, startingUserData, updatedUserData }: 
    { currentService: ServiceData[], ip: string, startingUserData: ServiceData, updatedUserData: any}) => {
        const services = currentService

        function portFromService(service: ServiceData) {
            // Ports may differ if the user has updated the value but not pushed changes.
            // TODO: Logic to handle when there are multiple ports used by a service.
            let port = service.options.find((option) => option.nixName?.includes("port"))?.value
            if (port) return port
            // Otherwise get the default port
            return ServiceFromName(service.nixName)?.options.find((option) => option.nixName?.includes("port"))?.value
        }
        let userData = startingUserData

        // Handle userdata logic here (for now)
        const nixSshKeyToHtmlString = (sshKey: string) => {
            let ret = sshKey.replaceAll("[", "").replaceAll("]","").replaceAll("\" ", "\n").replaceAll("\"", "")

            return ret
        } 

        const sshKeyOption = userData?.options?.find(option => option.nixName === "openssh.authorizedKeys.keys");
        const sshKeys = sshKeyOption ? nixSshKeyToHtmlString(sshKeyOption.value): "";
        const [sshKey, setSshKey] = useState<string>(sshKeys);
        
        return (
            <>
                <Header level={2}>Access</Header>

                <p> Your xnode is running at {ip}</p>

                <ul className="flex flex-wrap">
                {services.map((service) => (
                    <li key={service.nixName} className="mb-2 mr-2">
                        <Button> 
                            <a href={`http://${ip}:${portFromService(service)}`} 
                            target="_blank" rel="noreferrer noopener">
                            {service.nixName}
                            </a>
                        </Button>          
                        <br />
                    </li>
                ))}
                </ul>
                

                <p> The following openssh public keys are whitelisted on the xnode user: </p>
                {
                    sshKey && (
                        <div className="auto block w-full overflow-auto border p-2"> <p className="text-nowrap"> {sshKey} </p> </div>
                    )   
                }
                <br></br>
                <code> ssh -i path/to/key xnode@{ip} </code>
                <Dialog>
                    <div className="flex items-center space-x-4">
                        <DialogTrigger className="inline-flex h-10 min-w-24 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-primary/95 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                            Edit
                        </DialogTrigger>
                    </div>

                    <DialogContent style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        <DialogHeader>
                            <DialogTitle>Edit ssh keys.</DialogTitle>
                            <DialogDescription> Enter whitelisted ssh keys separated by newlines. </DialogDescription>
                        </DialogHeader>

                        <textarea
                            value={sshKey}
                            onChange={(e) => setSshKey(e.target.value)}
                            className="mb-4 h-32 w-full resize-none text-nowrap rounded border border-gray-300 p-2"
                            placeholder="Enter ssh key..."
                        />

                        <DialogFooter>
                            <DialogClose> Close </DialogClose>
                            <DialogClose onClick={() => updatedUserData(sshUserData(sshKey))}> Save </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </>
        )
    }
    export default ServiceAccess;
