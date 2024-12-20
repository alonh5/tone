import { LogOut, Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { DisconnectWalletDialog } from '../Dialogs/DisconnectWalletDialog';
import { useCallback, useState } from 'react';
import { SrcPrefix } from '../../utils/consts';
import { truncateAddress } from '../../utils/string';
import { useAccount, UseAccountResult, useDisconnect } from '@starknet-react/core';
import { ConnectWalletButton } from '../ConnectWalletButton/ConnectWalletButton';
import { CallData } from 'starknet';

export const Header = ({
  onConnectWallet,
  wallet,
}: {
  onConnectWallet: () => void;
  wallet?: UseAccountResult;
}) => {
  const [isDisconnectDialogOpen, setIsDisconnectDialogOpen] =
    useState<boolean>(false);
  const { disconnect } = useDisconnect();
  const handleCloseDisconnectDialog = useCallback(() => {
    setIsDisconnectDialogOpen(false);
  }, []);
  const starknetWallet = useAccount();

  const handleDisconnect = useCallback(() => {
    disconnect();
    handleCloseDisconnectDialog();
  }, []);

  const openDisconnectDialog = () => {
    setIsDisconnectDialogOpen(true);
  };

  const subscribe = () => {
    if (!starknetWallet.account) {
      alert("You must connect a wallet first");
      return;
    }
    starknetWallet.account.execute([
      {
        contractAddress: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
        entrypoint: "approve",
        calldata: CallData.compile({
          spender: "0x057185459c594a0716ad6e44c04cdf9cbfb8510e7d34f23d6c50ee584fcb930f",
          amount: 2000,
          amount1: 0,
        }),
      },
      {
        contractAddress: "0x057185459c594a0716ad6e44c04cdf9cbfb8510e7d34f23d6c50ee584fcb930f",
        entrypoint: "subscribe",
        calldata: CallData.compile({}),
      },
    ]);
  };

  return (
    <header className="bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <img
              src={`${SrcPrefix}/tone-logo-transparent.png`}
              alt="Tone Logo"
              className="h-12"
            />
            <h1 className="text-3xl font-bold" style={{ color: "#a5a5ff" }}>
              Tone
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={subscribe}
              className="text-black hover:text-blue-300"
            >
              <Mail className="h-4 w-4 mr-2" />
              <span>Subscribe</span>
            </Button>
            {wallet?.isConnected ? (
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
                <span className="text-sm font-medium" style={{ color: "#d1c4ff" }}>
                  {truncateAddress(wallet?.address ?? '')}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={openDisconnectDialog}
                  className="text-black hover:text-blue-300"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect wallet</span>
                </Button>
              </div>
            ) : (
              <ConnectWalletButton onConnect={onConnectWallet} />
            )}
          </div>
        </div>
      </div>
      <DisconnectWalletDialog
        onDisconnect={handleDisconnect}
        open={isDisconnectDialogOpen}
        onClose={handleCloseDisconnectDialog}
      />
    </header>
  );
};
