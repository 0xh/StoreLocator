<?php
namespace PandaGroup\StoreLocator\Controller\Adminhtml\Index;

use Magento\Framework\Exception\LocalizedException;

class Save extends \Magento\Backend\App\Action
{
    /** @var \Magento\Framework\App\Request\DataPersistorInterface  */
    protected $dataPersistor;

    /** @var \PandaGroup\StoreLocator\Model\RegionsData  */
    protected $regionsData;

    /** @var \PandaGroup\StoreLocator\Model\States  */
    protected $states;

    /** @var \PandaGroup\StoreLocator\Model\StatesFactory  */
    protected $statesFactory;


    public function __construct(
        \Magento\Backend\App\Action\Context $context,
        \Magento\Framework\Registry $registry,
        \Magento\Framework\App\Request\DataPersistorInterface $dataPersistor,
        \PandaGroup\StoreLocator\Model\RegionsData $regionsData,
        \PandaGroup\StoreLocator\Model\States $states,
        \PandaGroup\StoreLocator\Model\StatesFactory $statesFactory
    ) {
        $this->dataPersistor = $dataPersistor;
        $this->regionsData = $regionsData;
        $this->states = $states;
        $this->statesFactory = $statesFactory;
        parent::__construct($context);
    }

    public function execute()
    {
        /** @var \Magento\Backend\Model\View\Result\Redirect $resultRedirect */
        $resultRedirect = $this->resultRedirectFactory->create();
        $data = $this->getRequest()->getPostValue();
        if ($data) {
            $id = $this->getRequest()->getParam('id');

            /*
            if (isset($data['is_active']) && $data['is_active'] === 'true') {
                $data['is_active'] = Faq::STATUS_ENABLED;
            }
            if (empty($data['entity_id'])) {
                $data['entity_id'] = null;
            }
            */

            $stateIdFromStatesDataSource = $this->getRequest()->getPostValue('state_source_id');
            $newStateIdFromStoreLocatorStates = $this->addOrSaveStateFromRegionsData($stateIdFromStatesDataSource, $data);
            $data['state_id'] = $newStateIdFromStoreLocatorStates;

            $model = $this->_objectManager->create('PandaGroup\StoreLocator\Model\StoreLocator')->load($id);
            if (!$model->getId() && $id) {
                $this->messageManager->addErrorMessage(__('This store no longer exists.'));

                return $resultRedirect->setPath('*/*/');
            }

            $model->setData($data);

            try {
                $model->save();
                $this->messageManager->addSuccessMessage(__('You saved the store.'));
                $this->dataPersistor->clear('storelocator');

                if ($this->getRequest()->getParam('back')) {
                    return $resultRedirect->setPath('*/*/edit', ['id' => $model->getId()]);
                }

                return $resultRedirect->setPath('*/*/');
            } catch (LocalizedException $e) {
                $this->messageManager->addErrorMessage($e->getMessage());
            } catch (\Exception $e) {
                $this->messageManager->addExceptionMessage($e, __('Something went wrong while saving the store.'));
            }

            $this->dataPersistor->set('storelocator', $data);

            return $resultRedirect->setPath('*/*/edit', ['storelocator_id' => $this->getRequest()->getParam('storelocator_id')]);
        }

        return $resultRedirect->setPath('*/*/');
    }

    /**
     * @param $stateIdFromStatesDataSource
     * @param $data
     * @return int
     */
    protected function addOrSaveStateFromRegionsData($stateIdFromStatesDataSource, $data)
    {
        $stateExists = $this->states->getCollection()->addFilter('state_source_id', $stateIdFromStatesDataSource)->getData();
        if (true === empty($stateExists)) {

            $state = $this->statesFactory->create();

            $params = [
                'state_source_id'   => $stateIdFromStatesDataSource,
                'state_name'        => $this->regionsData->load($stateIdFromStatesDataSource)->getData('name'),
                'state_short_name'  => $this->regionsData->load($stateIdFromStatesDataSource)->getData('name'),
                'country'           => $data['country'],
            ];

            $state->addData($params);

            try {
                $state->save();
                $this->messageManager->addSuccessMessage(__('You created the new region.'));
            } catch (\Exception $e) {
                $this->messageManager->addSuccessMessage(__('Something went wrong while creating the new region.'));
            }
            return (int) $state->getId();

        } else {
            $state = $this->states->load($stateExists[0]['state_id']);
            return (int) $state->getId();
        }

    }

}
