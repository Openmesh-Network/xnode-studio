import { ServiceData, ServiceOption, ServiceFromName, XnodeConfig } from "@/types/dataProvider";
import Header from '@/components/ui/header'
import { useState } from "react";
import { Button } from '@/components/ui/button'
import TextInputPopup from '@/components/Deployments/InputEditor'

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

        function portFromName(serviceName) {
            let accessingService = ServiceFromName(serviceName);
            return accessingService?.options.find((option) => option.name === "port")?.value
        }
        const [isSSHPopupOpen, setSSHIsPopupOpen] = useState(false);

        let userData = startingUserData

        const sshKeyOption = userData?.options?.find(option => option.nixName === "openssh.authorizedKeys.keys");
        const sshKeys = sshKeyOption ? sshKeyOption.value.replace('[]',''): "";
        const [sshKey, setSSHKey] = useState<string>(sshKeys);


        // Handle userdata logic here (for now)

        const nixSshKeyToHtmlString = (sshKey) => {
            return sshKey.replaceAll("[", "").replaceAll("]","").replaceAll("\" ", "\n").replaceAll("\"", "")
        } 
        
        return (
            <>
            <Header level={2}>Access</Header>

            <p> Running on {ip} </p>

            {services.map((service) => (
                <div key={service.nixName} className="access">
                    <a href={`http://${ip}:${portFromName(service.nixName)}`}
                    style={{
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                    }}
                    >
                        {service.nixName}
                    </a>            
                    <br />
                </div>
            ))}
            <p>Edit SSH Key</p>
            <div className="flex items-center space-x-4">
                <Button onClick={() => setSSHIsPopupOpen(true)}>    Edit    </Button>                       
                <Button onClick={() => updatedUserData(sshUserData(sshKey))}>    Save    </Button>
            </div>
            <TextInputPopup
                isOpen={isSSHPopupOpen}
                onClose={() => setSSHIsPopupOpen(false)}
                setInputValue = {setSSHKey}
                curValue={nixSshKeyToHtmlString(sshKeys)}
            />
            {sshKey && <p className="mt-4">SSH key: {nixSshKeyToHtmlString(sshKey)}</p>}
            </>
        )
    }
    export default ServiceAccess;
