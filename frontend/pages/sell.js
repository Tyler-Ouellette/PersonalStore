import CreateItem from '../components/CreateItem'
import PleaseLogin from '../components/PleaseLogin'

const Sell = props => (
    <div>
        <PleaseLogin>
            <CreateItem />
        </PleaseLogin>
    </div>
);

export default Sell;