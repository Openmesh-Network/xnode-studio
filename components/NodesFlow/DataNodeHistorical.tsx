import { useContext, useEffect, useState } from 'react'
import { AccountContext } from '@/contexts/AccountContext'
import { categoriesOptions } from '@/utils/constants'
import { Handle, Position, useReactFlow, useStoreApi } from 'reactflow'

import withProps from './withProps'

const options = [
  {
    value: 'smoothstep',
    label: 'Smoothstep',
  },
  {
    value: 'step',
    label: 'Step',
  },
  {
    value: 'default',
    label: 'Bezier (default)',
  },
  {
    value: 'straight',
    label: 'Straight',
  },
]

function Select({ value, handleId, nodeId }) {
  const { setNodes } = useReactFlow()
  const store = useStoreApi()

  const onChange = (evt) => {
    const { nodeInternals } = store.getState()
    setNodes(
      Array.from(nodeInternals.values()).map((node) => {
        if (node.id === nodeId) {
          node.data = {
            ...node.data,
            selects: {
              ...node.data.selects,
              [handleId]: evt.target.value,
            },
          }
        }
        return node
      })
    )
  }

  return (
    <div className="custom-node__select">
      <div>Edge Type</div>
      <select
        className="nodrag rounded-[6px] bg-[#D9D9D9]"
        onChange={onChange}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Handle type="source" position={Position.Right} id={handleId} />
    </div>
  )
}

function Options({ handleId, name, optionsSelection }) {
  const { setNodes } = useReactFlow()
  const store = useStoreApi()
  const [selected, setSelected] = useState<any>()

  return (
    <div className="">
      <select
        className="nodrag min-w-[85px] rounded-[6px] bg-[#D9D9D9] font-normal md:min-w-[104px] lg:min-w-[120px] xl:min-w-[138px] 2xl:min-w-[172px]"
        onChange={(option) => setSelected(option.target.value)}
        value={selected}
      >
        {optionsSelection.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

function DataNodeHistorical({ id, data, handleNodeRemove }) {
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(true)
  const [selectedItemsS, setSelectedItemsS] = useState<any>(data.lists)
  const { selectionSideNavBar, setChangeNodes, changeNodes, setRemoveNodes } =
    useContext(AccountContext)
  const handleClick = () => {
    handleNodeRemove(id)
  }

  useEffect(() => {
    setSelectedItemsS(data.lists)
    setChangeNodes({
      type: 'dataHistorical',
      name: 'dataOption.title',
      icon: 'dataOption.icon',
      categorie: 'option.title',
      dictionary: categoriesOptions,
    })
  }, [data.lists, setChangeNodes])

  /* This is for rendering pourposes, use data.lists for real data as it shows the correct amount of items but uncategorized. You can see some duplicated items in multiple categories because of the current mockupdata,
   it will be different as we add real data.
   */
  function renderCategorizedItems() {
    const selectedItems = data.lists

    const categoriesDictionary = changeNodes?.dictionary
    const listOfCategorizedItems = categoriesDictionary?.map((category) => {
      const selectedCategoryItems =
        selectedItems?.filter((item) =>
          category?.dataOptions?.some((option) => option.title === item.title)
        ) || []
      if (selectedCategoryItems.length > 0) {
        return (
          <div key={category.title}>
            <div>{category.title}</div>
            {selectedCategoryItems.map((item) => (
              <div
                key={item.title}
                className="relative flex cursor-pointer text-[#000]"
              >
                <div className="my-[10px] ml-[10px] flex gap-x-[9px] text-[7.5px] font-normal hover:font-normal md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                  <img
                    src={`${
                      process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                        ? process.env.NEXT_PUBLIC_BASE_PATH
                        : ''
                    }${item.icon}`}
                    alt="image"
                    className={`w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]`}
                  />
                  <div className="cursor-pointer">{item.title}</div>
                  <div
                    onClick={() => {
                      setRemoveNodes([item.title, 'dataHistorical'])
                    }}
                    className="top-[10px] text-[8px] font-bold text-black hover:text-[#686868] xl:right-[-35px] 2xl:right-[-45px] 2xl:text-[10px]"
                  >
                    X
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      }
      // eslint-disable-next-line react/jsx-key
      return <div></div>
    })
    return listOfCategorizedItems
  }
  return (
    <>
      <div className="relative rounded-[20px] border-[0.5px] border-[#C1C1C1] bg-[#fff] px-[10px] py-[7px] pb-[23px] pr-[33px] text-[8px] text-[#000] md:px-[12px] md:py-[8.4px] md:pb-[15.6px] md:pr-[46px] md:text-[9.6px] lg:px-[14px] lg:py-[10px] lg:pb-[18px] lg:pr-[53px] lg:text-[11.2px] xl:px-[16px] xl:py-[11.2px] xl:pb-[21px] xl:pr-[61px] xl:text-[12.8px] 2xl:px-[20px] 2xl:py-[14px] 2xl:pb-[46px] 2xl:pr-[77px] 2xl:text-[16px]">
        <button
          onClick={() => {
            handleClick()
          }}
          className="absolute right-[5px] top-5 font-bold md:right-[6px] lg:right-[7px] xl:right-[8px] 2xl:right-[10px]"
        >
          X
        </button>
        <div className="flex w-full flex-row items-start gap-[10px]">
          <img
            src={`${
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'PROD'
                ? process.env.NEXT_PUBLIC_BASE_PATH
                : ''
            }/images/nodesFlow/databaseHistorical.svg`}
            alt="image"
            className={
              'w-[32 px] md:w-[29px] lg:w-[36.5px] xl:w-[39px] 2xl:w-[45px]'
            }
          />
          <div className="mt-[5px] text-[16px] font-bold md:mt-[6px] lg:mt-[7px] lg:!leading-[19px] xl:mt-[8px] 2xl:mt-[10px]">
            Historical Data
          </div>
        </div>
        <div className="absolute left-0 h-[0.5px] w-full bg-[#C1C1C1] lg:mt-[10px] 2xl:mt-[12px]"></div>
        <div className="text-[7px] md:text-[8.4px] lg:mt-[20px] lg:text-[10px] xl:mt-[24px] xl:text-[11.2px] 2xl:mt-[30px] 2xl:text-[14px]"></div>
        {/* <div className="mt-[6px] grid gap-y-[18px] pl-[5px] md:mt-[7.2px] md:gap-y-[19.2px] lg:mt-[8.4px] lg:gap-y-[22.5px] xl:mt-[9.6px] xl:gap-y-[16px] 2xl:mt-[12px] 2xl:gap-y-[20px]">
          {data.lists.map((list, index) => (
            <div key={index} className="relative flex text-[#000]">
              <div className="flex gap-x-[9px] text-[7.5px] font-normal  hover:font-normal md:text-[8.5px] lg:text-[10px] xl:text-[11.2px] 2xl:text-[14px]">
                <img
                  src={list.icon}
                  alt="image"
                  className={`w-[10px] md:w-[12px] lg:w-[14px] xl:w-[16px] 2xl:w-[20px]`}
                />
                <div className="cursor-pointer">{list.title}</div>
                <div className="absolute -top-[0px] font-medium text-[#0354EC] xl:-right-[35px] 2xl:-right-[45px]">
                  Edit
                </div>
              </div>
            </div>
          ))}
        </div> */}
        {renderCategorizedItems()}
        {/* {listOfCategorizedItems}
        <div
          onClick={() => {
            setSelectionSideNavBar('Data')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="mt-[20px] cursor-pointer pl-[5px] text-[7.5px] font-medium text-[#0354EC] md:mt-[24px] md:text-[8.5px] lg:mt-[28px] lg:text-[10px] xl:mt-[32px] xl:text-[11.2px] 2xl:mt-[40px] 2xl:text-[14px]"
        >
          Add
        </div> */}
        <Handle type="source" position={Position.Right} id={'1'} />
      </div>
    </>
  )
}

export default withProps(DataNodeHistorical, ['handleNodeRemove'])
