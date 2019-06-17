import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card, Label, Button} from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },

            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },

            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
    };

    init() {
        //let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        //loaderData.isLoading = false;
        //this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        this.loadData(() =>
            this.setState({ loaderData })
        );
        loaderData.isLoading = false;

        //console.log(this.state.loaderData)
    }


    componentDidMount() {
        this.init();
        //this.loadData();
    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
       
        $.ajax({
            url:link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: {
                activePage: this.state.activePage,
                sortByDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: this.state.filter.showDraft,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired
            },
            success: function (res) {
                if (res.myJobs) {
                    this.state.loadJobs = res.myJobs
                }
                console.log("Jobs", this.state.loadJobs);
                callback();

                //this.setState({ loadJobs: res.myJobs, totalPages: Math.ceil(res.totalCount / 6) }, callback);
            }.bind(this),
            error: function (res) {
                console.log(res.status);
                callback();
  
    
            }
        });
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    
    render() {
        let list = this.state.loadJobs;
        let datalist = [];
        let currentDate = new Date();
        if (list != "") {
            datalist = list.map(card =>
                <Card key={card.Id} >
                    <Card.Content>
                        <Card.Header>{card.title}</Card.Header>
                        <Label color="black" ribbon="right"><i className="user icon"></i>0</Label>
                        <Card.Meta>
                            <span className='date'>{card.location.city}, {card.location.country}</span>
                        </Card.Meta>
                        <Card.Description>{card.summary}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <span className="left floated">
                            {
                                card.expiryDate > currentDate.toISOString() ?
                                    <Label color='red'>Expired</Label>
                                    :
                                    <p></p>
                            }

                        </span>
                        <span className="right floated">
                            <Button.Group>
                                <Button basic color='blue'>Close</Button>
                                <Button basic color='blue'>Edit</Button>
                                <Button basic color='blue'>Copy</Button>
                            </Button.Group>
                        </span>
                    </Card.Content>
                </Card>
            )
        }
        else {

        
            datalist = "No Jobs Found";
        }

        console.log("list", this.props.datalist);

        const filterOptions = [
            { key: 'showActive', text: 'showActive', value: 'showActive' },
            { key: 'showClosed', text: 'showClosed', value: 'showClosed' },
            { key: 'showDraft', text: 'showDraft', value: 'showDraft' },
            { key: 'showExpired', text: 'showExpired', value: 'showExpired' },
            { key: 'showUnexpired', text: 'showUnexpired', value: 'showUnexpired' }
        ]

        const sortOptions = [
            { key: 'Newest', text: 'Newest First', value: 'Newest' },
            { key: 'Oldest', text: 'Oldest First', value: 'Oldest' }
        ]

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h2>List of Jobs</h2>
                    <div>
                        <span>
                            <Icon name="filter" />
                            Filter:
                            <Dropdown placeholder="Choose filter" inline options={filterOptions} />
                        </span>

                        <span>
                            <Icon name="alternate outline calendar" />
                            Sort By Date:
                            <Dropdown inline options={sortOptions} defaultValue={sortOptions[0].value} />
                        </span>


                        <br/>
                    </div>
                    <div className="ui three cards">
                        {datalist}
                    </div>
                    <br/>
                    <div align="center">
                        <Pagination
                            defaultActivePage={1}
                            totalPages={5}
                        />
                    </div>
                    <br/>
                </div>
            </BodyWrapper>
        )
    }
}
