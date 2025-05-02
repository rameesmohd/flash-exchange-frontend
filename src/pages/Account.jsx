import React from 'react'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Space } from 'antd';
import profileAvatar from '../../public/profile-avatar.jpeg'
import { LuNotebook } from "react-icons/lu";
import { RiBankCardLine } from "react-icons/ri";
import { VscHistory } from "react-icons/vsc";
import { RiLuggageDepositLine } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { RiTeamLine } from "react-icons/ri";
import { PiShareNetworkBold } from "react-icons/pi";
import { TbExchange } from "react-icons/tb";
import { MdNavigateNext } from "react-icons/md";
import PageWrapper from '../components/client/PageWrapper'

const Account = () => {

  const options = [
    {
      title : "Statement",
      icon : <LuNotebook />
    },
    {
      title : "Bank card",
      icon : <RiBankCardLine />
    },
    {
      title : "Exchange history",
      icon : <VscHistory />
    },
    {
      title : "Deposit history",
      icon : <RiLuggageDepositLine />
    },
    {
      title : "Withdraw history",
      icon : <BiMoneyWithdraw />
    },
    {
      title : "Team benefits",
      icon : <RiTeamLine />
    },
    {
      title : "My referrals",
      icon : <PiShareNetworkBold />
    },
    {
      title : "Reset transaction password",
      icon : <TbExchange />
    }
  ]



  return (
    <PageWrapper>
    <div className='p-4'>
      <div className='flex'>
       <Avatar size={64} icon={<><img src={profileAvatar} alt="" srcset="" /></>} />
       <div>
        <div className='mx-3 text-lg font-bold'>+91 85***5696</div>
        <div className='p-2'>
        <Button size='small' type='primary' className='mr-2 text-white border text-xs bg-blue-600'>Deposit</Button>
        <Button size='small' className='text-xs'>Withdraw</Button>
        </div>
       </div>
      </div>

      <Card size="small" className="rounded-lg border-none bg-black my-2">
        <div className="justify-between text-xs text-gray-500 mb-2">
          <div className='text-lg font-bold text-white'>Invite your friends</div>
          <div className='text-gray-300 text-xs'>Earn upto 5% commission</div>
        </div>
        <Button size='small' className='text-xs text-white bg-violet-400 border-none rounded-lg'>Get Started</Button>
      </Card>

      <div>
          {
            options.map((value,index)=>
              <div key={index} className='flex items-center justify-between my-4  text-sm'>
                <div className='flex items-center'>
                <div className=''>{value.icon}</div>
                <div className='mx-1'>{value.title}</div>
                </div>

                <MdNavigateNext />
              </div>
            )
          }
      </div>
      
      <Button
        type="primary"
        className="bg-black top-10 h-10 w-full text-white rounded-md"
        size="large"
        block
      >
        Sign Out
      </Button>

    </div>
    </PageWrapper>
  )
}

export default Account
