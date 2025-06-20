# ❌ Erro: Tela cinza no GUI do proxmox
# ✅ Solução: reinstalar o pve-manager com repositórios gratuitos corretamente configurados

Siga esses passos com atenção:

## 1. Corrigir repositórios (se ainda não corrigiu)
Execute:
```bash
rm /etc/apt/sources.list.d/pve-enterprise.list
rm /etc/apt/sources.list.d/ceph.list
```
Agora crie o repositório no-subscription:

```bash
echo "deb http://download.proxmox.com/debian/pve bookworm pve-no-subscription" > /etc/apt/sources.list.d/pve-no-subscription.list
```
E (opcional, se usar Ceph):

```bash
echo "deb http://download.proxmox.com/debian/ceph-quincy bookworm main" > /etc/apt/sources.list.d/ceph.list
```

## 2. Importar a chave do Proxmox (caso necessário)
```bash
wget http://download.proxmox.com/debian/proxmox-release-bookworm.gpg -O /etc/apt/trusted.gpg.d/proxmox-release-bookworm.gpg
```

## 3. Atualizar pacotes
```bash
apt-get update
```

## 4. Reinstalar o pve-manager
```bash
apt-get install --reinstall pve-manager
```
Esse comando deve restaurar todos os arquivos da interface web, inclusive o StdWorkspace.js.

## 5. Reiniciar serviços
```bash
systemctl restart pveproxy
systemctl restart pvedaemon
```

## 6. Reinstalar toolkit
```bash 
apt install --reinstall proxmox-widget-toolkit
```
---