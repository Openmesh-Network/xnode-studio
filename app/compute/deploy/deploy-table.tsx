import { Circle } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import {
  RadioGroup,
  RadioGroupCard,
  RadioGroupIndicator,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Icons } from '@/components/Icons'

const products = [
  {
    id: 1,
    providerName: 'Equinix',
    productName: 'Intel E-2388G',
    cpu: '3.4 GHz 8c',
    ram: '16GB',
    storage: '320GB',
    bandwidth: '10TB',
    cashback: '$120',
    price: '$372',
    icon: Icons.EthereumIcon,
  },
  {
    id: 2,
    providerName: 'Equinix',
    productName: 'Intel E-2388G',
    cpu: '3.4 GHz 8c',
    ram: '16GB',
    storage: '320GB',
    bandwidth: '10TB',
    cashback: '$120',
    price: '$372',
    icon: Icons.EthereumIcon,
  },
  {
    id: 3,
    providerName: 'Equinix',
    productName: 'Intel E-2388G',
    cpu: '3.4 GHz 8c',
    ram: '16GB',
    storage: '320GB',
    bandwidth: '10TB',
    cashback: '$120',
    price: '$372',
    icon: Icons.BNBIcon,
  },
  {
    id: 4,
    providerName: 'Equinix',
    productName: 'Intel E-2388G',
    cpu: '3.4 GHz 8c',
    ram: '16GB',
    storage: '320GB',
    bandwidth: '10TB',
    cashback: '$120',
    price: '$372',
    icon: Icons.AvaxCircleIcon,
  },
  {
    id: 5,
    providerName: 'Equinix',
    productName: 'Intel E-2388G',
    cpu: '3.4 GHz 8c',
    ram: '16GB',
    storage: '320GB',
    bandwidth: '10TB',
    cashback: '$120',
    price: '$372',
    icon: Icons.AvaxCircleIcon,
  },
]

const tableCollumns = [
  '',
  'Provider Name',
  'Product Name',
  'CPU',
  'RAM',
  'Storage',
  'Band (TB)',
  'Cashback',
  'Price',
]

export function DeployTable() {
  return (
    <RadioGroup>
      <Table>
        <TableHeader className="bg-[#D1D5DB]">
          <TableRow className="first:text-left">
            {tableCollumns.map((column, index) => (
              <TableHead
                className={cn(
                  index == 1 ? 'text-left' : 'text-center',
                  'text-card-foreground font-normal'
                )}
                key={index}
              >
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow
              key={index}
              className="odd:bg-muted/40 h-14 border-none text-center font-semibold odd:rounded-lg"
            >
              <TableCell className="">
                <RadioGroupItem
                  value={`radio-${product.id} ${product.productName}`}
                  id={`radio-${product.id} ${product.productName}`}
                />
              </TableCell>
              <TableCell className="flex h-14 items-center space-x-2">
                <product.icon className="size-7" />
                <span className="text-sm">{product.providerName}</span>
              </TableCell>
              <TableCell>{product.productName}</TableCell>
              <TableCell>{product.cpu}</TableCell>
              <TableCell>{product.ram}</TableCell>
              <TableCell>{product.storage}</TableCell>
              <TableCell>{product.bandwidth}</TableCell>
              <TableCell>{product.cashback}</TableCell>
              <TableCell className="text-primary">{product.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </RadioGroup>
  )
}
