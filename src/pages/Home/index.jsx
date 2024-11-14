import { TypeAnimation } from 'react-type-animation';
import './index.css';
import { Row, Col, Button, Flex } from 'antd';
import { ArrowRightOutlined} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navigate = useNavigate();

  return (
    <div className="bg-homepage">
        <div className="backdrop"></div>
        <Row className='h-screen' justify="center" align="middle">
            <Col span={12}>
                <Flex align='center' justify='center' vertical>
                    <TypeAnimation
                        sequence={[
                            'One',
                            500,
                            'Thre Two',
                            500,
                            'One Two Three',
                            500,
                            'One Two',
                            500,
                            'One',
                            500,
                            '',
                            500,
                        ]}
                        style={{ fontSize: '3rem' }}
                        className='text-white font-bold'
                        repeat={Infinity}
                    />
                    <Button onClick={()=>navigate('/playlist')} size='large' className='my-4' type="primary" iconPosition='end' icon={<ArrowRightOutlined />}>
                        Playlist NPM INSTALL
                    </Button>
                </Flex>
            </Col>
        </Row>

    </div>
  )
}

export default Home