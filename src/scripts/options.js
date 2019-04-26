import preact from 'preact';
import { settings } from './util';

class InlineLoader extends preact.Component {
    loaderColours = [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'dark'
    ];

    randomColour() {
        return this.loaderColours[Math.floor(Math.random() * this.loaderColours.length)];
    }

    renderLoading() {
        return (
            <div className="text-center">
                <div className={`spinner-border text-${this.randomColour()}`} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    render() {
        if (this.props.value === this.props.unloadedValue) {
            return this.renderLoading();
        }
        return this.props.children[0];
    }
}

class OptionsUiComponent extends preact.Component {
    state = {
        highScore: -1,
        totalTabs: -1,
        keysPressed: -1,
        closeWaitTime: -1,
        closeOnComplete: null,
        ignorePinnedTabs: null,
        leftButton: null,
        rightButton: null,
        settingHasChanged: false
    };

    saveTimeout = null;

    componentDidMount() {
        this.loadSettings();
    }

    componentWillUnmount() {
        if (this.saveTimeout) {
            window.clearTimeout(this.saveTimeout);
        }
    }

    loadSettings() {
        // load individually so each piece of the UI is avalible when complete
        settings.highScore().then(highScore => this.setState({ highScore }));
        settings.totalTabs().then(totalTabs => this.setState({ totalTabs }));
        settings.keysPressed().then(keysPressed => this.setState({ keysPressed }));
        settings.closeWaitTime().then(closeWaitTime => this.setState({ closeWaitTime }));
        settings.closeOnComplete().then(closeOnComplete => this.setState({ closeOnComplete }));
        settings.ignorePinnedTabs().then(ignorePinnedTabs => this.setState({ ignorePinnedTabs }));
        settings.leftButton().then(leftButton => this.setState({ leftButton }));
        settings.rightButton().then(rightButton => this.setState({ rightButton }));
    }

    async resetSettings() {
        await settings.reset();
        this.loadSettings();
    }

    saveSettingChange(name, newValue) {
        this.setState({ [name]: newValue, settingHasChanged: true });
        settings[name](newValue);
        if (this.saveTimeout) {
            window.clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = window.setTimeout(() => {
            this.setState({
                settingHasChanged: false
            });
        }, 2000);
    }

    renderHighScore() {
        return (
            <div className="row justify-content-center">
                <div className="col-sm-4 justify-content-center text-center text-uppercase">
                    <InlineLoader value={this.state.highScore} unloadedValue={-1}>
                        <h1>{this.state.highScore} Tabs</h1>
                    </InlineLoader>
                    <small>HIGH SCORE</small>
                </div>
            </div>
        );
    }

    renderQuickStats() {
        return (
            <div>
                <h3>Quick Stats</h3>
                <br />
                <table className="table table-hover table-striped table-sm">
                    <tbody>
                        <tr>
                            <th scope="row">High Score</th>
                            <td className="text-right">
                                <InlineLoader value={this.state.highScore} unloadedValue={-1}>
                                    {this.state.highScore}
                                </InlineLoader>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Total Tabs</th>
                            <td className="text-right">
                                <InlineLoader value={this.state.totalTabs} unloadedValue={-1}>
                                    {this.state.totalTabs}
                                </InlineLoader>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Keys Pressed</th>
                            <td className="text-right">
                                <InlineLoader value={this.state.keysPressed} unloadedValue={-1}>
                                    {this.state.keysPressed}
                                </InlineLoader>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }

    generateKeyMenuOptions() {
        return Array.from(Array(128 - 33).keys()).map(i => String.fromCharCode(i + 32)).concat([
            'ENTER',
            'LEFT',
            'RIGHT',
            'UP',
            'DOWN',
            'SHIFT',
            'CTRL'
        ]).map(arg => (
            <option value={arg}>{arg}</option>
        ));
    }

    renderSettings() {
        return (
            <div>
                <div className="row align-items-center">
                    <div className="col-sm-4">
                        <h3>Settings</h3>
                        <br />
                    </div>
                    <div className="col-sm-8">
                        <h6>
                            {
                                this.state.settingHasChanged ?
                                (
                                    <span className="text-success">Changes Saved</span>
                                )
                                :
                                (
                                    <i>Settings are automatically saved.</i>
                                )
                            }
                        </h6>
                    </div>
                </div>
                <form>
                    <div className="form-group row align-items-center">
                        <div className="col-sm-4">Close window when game is complete</div>
                        <div className="col-sm-8">
                            <InlineLoader value={this.state.closeOnComplete} unloadedValue={null}>
                                <div className="form-check">
                                    <input className="form-check-input"
                                           type="checkbox"
                                           id="settings-close-on-complete"
                                           defaultChecked={this.state.closeOnComplete || false}
                                           onChange={e => this.saveSettingChange('closeOnComplete', e.target.checked)} />
                                    <label className="form-check-label" for="settings-close-on-complete">
                                        When this is selected, the game will close after a short period when it is complete
                                    </label>
                                </div>
                            </InlineLoader>
                        </div>
                    </div>
                    <div className={`form-group row align-items-center${this.state.closeOnComplete === false ? ' d-none' : ''}`}>
                        <div className="col-sm-4">Time to wait before close</div>
                        <div className="col-sm-7">
                            <InlineLoader value={this.state.closeWaitTime} unloadedValue={-1}>
                                <input type="range"
                                       className="custom-range"
                                       min="0"
                                       max="30"
                                       step="1"
                                       id="settings-close-duration"
                                       value={this.state.closeWaitTime}
                                       onChange={e => this.saveSettingChange('closeWaitTime', parseInt(e.target.value.toString()))} />
                            </InlineLoader>
                        </div>
                        <div className="col-sm-1">
                            <label className="form-check-label" for="settings-close-duration">
                                <InlineLoader value={this.state.closeWaitTime} unloadedValue={-1}>
                                    {this.state.closeWaitTime}&nbsp;sec
                                </InlineLoader>
                            </label>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <div className="col-sm-4">Ignore pinned tabs</div>
                        <div className="col-sm-8">
                            <InlineLoader value={this.state.ignorePinnedTabs} unloadedValue={null}>
                                <div className="form-check">
                                    <input className="form-check-input"
                                           type="checkbox"
                                           id="settings-ignore-pinned-tabs"
                                           defaultChecked={this.state.ignorePinnedTabs || false}
                                           onChange={e => this.saveSettingChange('ignorePinnedTabs', e.target.checked)} />
                                    <label className="form-check-label" for="settings-ignore-pinned-tabs">
                                    When this is selected, pinned tabs will not be shown or closed
                                    </label>
                                </div>
                            </InlineLoader>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <div className="col-sm-4">Move left button</div>
                        <div className="col-sm-8">
                            <InlineLoader value={this.state.leftButton} unloadedValue={null}>
                                <select className="custom-select"
                                        value={this.state.leftButton}
                                        onChange={e => this.saveSettingChange('leftButton', e.target.value)}>
                                    {this.generateKeyMenuOptions(this.state.leftButton)}
                                </select>
                            </InlineLoader>
                        </div>
                    </div>
                    <div className="form-group row align-items-center">
                        <div className="col-sm-4">Move right button</div>
                        <div className="col-sm-8">
                            <InlineLoader value={this.state.rightButton} unloadedValue={null}>
                                <select className="custom-select"
                                        value={this.state.rightButton}
                                        onChange={e => this.saveSettingChange('rightButton', e.target.value)}>
                                    {this.generateKeyMenuOptions(this.state.rightButton)}
                                </select>
                            </InlineLoader>
                        </div>
                    </div>
                    <button className="btn btn-danger" onClick={() => settings.reset()}>Reset High Score and Stats</button>
                </form>
            </div>
        );
    }

    render() {
        return (
            <div className="container">
                <br />
                {this.renderHighScore()}
                <br />
                <hr />
                <br />
                {this.renderQuickStats()}
                <br />
                <hr />
                <br />
                {this.renderSettings()}
                <br />
                <br />
            </div>
        );
    }
}

preact.render(<OptionsUiComponent />, document.getElementById('preact-root'));
