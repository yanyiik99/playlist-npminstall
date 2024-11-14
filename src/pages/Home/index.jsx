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
                            'Hi Theere,',
                            200,
                            'Hi The',
                            200,
                            'Hi There,',
                            2000,
                            'We Are',
                            2000,
                            'New Team',
                            2000,
                            'NPM INSTALL',
                            10000,
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